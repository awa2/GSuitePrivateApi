# GSuite Private Api Kit
Google Apps Script for GSuite users as Private API or batch apps.
You can use this kit by deploying your Google Apps Script enviroment.

## Use case
### IFTTT + Calendar
IFTTT provides GSuite integration, but it can make just simple flow.
So, you can set up customised web API by this kit.

```
[IFTTT] --<HTTP Request>--> [Kit by GAS] --> [Your GSuite API]
```

You can add conditions or any other complicated process by this kit easily.
So, 
```
+[IFTTT]------------------------------------------+
|  [When Calendar event added]                    |
|                       =>[Webhook is executed]   |
+-------------------------------------------------+
                         |
                  <HTTP Request>
                         v
+[Google Apps Script]-----------------------------+
|  [If the event created after 7:00 pm]           |
|    =>[The event is copied to another calendar]  |
+-------------------------------------------------+
```

### Gmail event + Slack
Currently IFTTT stops to privide Gmail integration.
But you can do same way by this kit, with simple batch app.
It is likely long polling.
```
+[Google Apps Script]-----------------------------+
|  <BatchApp()>                                   |
|    `- Observing gmail every 5min                |
+-------------------------------------------------+
|  [If message has arrived]                       |
|                            =>[Notify to Slack]  |
+-------------------------------------------------+
```

