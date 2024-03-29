import { BatchApp, process, md5sum } from '@ts-module-for-gas/gas-utilities';
import { Slack, Attachment } from '@ts-module-for-gas/gas-slack';
import { gmailToSlackAttachment } from './batch/gmailToSlackAttachment';
const INTERVAL = 5;


// Batch proccessing application
// NOTE : This generates regulary scheduled function by GAS time-based trigger.
//        It uses for creating event-driven function.
//
function batchApp() {

    // [SETTINGS]
    // SLACK_BOT_NAME : Your Slack bot's name
    // SLACK_BOT_TOKEN : Your Slack app's bot token
    // 
    const SlackBot = new Slack.Bot(process.env['SLACK_BOT_NAME'] as string, process.env['SLACK_BOT_TOKEN'] as string);

    const app = new BatchApp('batchApp', INTERVAL);

    // [SETTING EXAMPLE]
    // CONDITIONS_FOR_MAIL : Set gmail search conditions, such as 'from:(github.com)', with Array( [{"condition":"from:(github.com)","channel":"CD12345"}] );
    const ConditionsForMail = process.env['CONDITIONS_FOR_MAIL'] as { condition: string, channel: string}[];
    ConditionsForMail.map(conditionForMail => {
        app.onGmailReceived(conditionForMail.condition, (message) =>{
            const attachment = gmailToSlackAttachment(message);
            SlackBot.post(conditionForMail.channel, attachment);
        });
    })

    app.end();
}

function stop_batch() {
    const app = new BatchApp('batchApp');
    app.stop();
}