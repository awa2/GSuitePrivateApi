import { Attachment } from '@ts-module-for-gas/gas-slack';

export function gmailToSlackAttachment(message: GoogleAppsScript.Gmail.GmailMessage){
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

    return attachment;
}