import { BatchApp, process, md5sum } from '@ts-module-for-gas/gas-utilities';
import { Slack, Attachment } from '@ts-module-for-gas/gas-slack';

const INTERVAL = 5;

function batchApp() {

    // [SETTINGS]
    // SLACK_BOT_NAME : Your Slack bot's name
    // SLACK_BOT_TOKEN : Your Slack app's bot token
    // PRIVATE_CHANNEL : Channel notify to
    // 
    const SlackBot = new Slack.Bot(process.env['SLACK_BOT_NAME'] as string, process.env['SLACK_BOT_TOKEN'] as string);
    const channel = process.env['PRIVATE_CHANNEL'] as string;

    const app = new BatchApp();

    // [SETTINGS]
    // CONDITIONS_FOR_MAIL : Set gmail search conditions, such as 'from:(github.com)', with Array(string[]);
    // 
    const ConditionsForMail = process.env['CONDITIONS_FOR_MAIL'] as string[];
    ConditionsForMail.map(condition => {
        app.onGmailReceived(condition, (message) => {
            const attachment: Attachment = {
                title: message.getSubject(),
                title_link: message.getThread().getPermalink(),
                text: message.getPlainBody(),
                fields: [
                    { title: 'To', value: message.getTo(), short: true },
                    { title: 'From', value: message.getFrom(), short: true },
                ],
                footer: Utilities.formatDate(message.getDate(), 'JST', 'yyyy/MM/dd hh:mm:ss')
            };
            const cc = message.getCc();
            if (cc) { attachment.fields.push({ title: 'CC', value: cc, short: true }) }
            const bcc = message.getBcc();
            if (bcc) { attachment.fields.push({ title: 'BCC', value: bcc, short: true }) }

            SlackBot.post(channel, attachment);
        });
    })

    app.end();
}