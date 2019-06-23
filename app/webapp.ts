import { WebApp } from '@ts-module-for-gas/gas-http';
import { process} from '@ts-module-for-gas/gas-utilities';

export function webApp(e: any) {
    process.event.store(e);
    process.log(e);

    const app = new WebApp();

    app.post({ calendar: 'copy' }, (req, res) => {
        const condition = req.body['condition'] ? req.body['condition'] as {
            ifStartedAfter?: string,
            ifHoliday?: boolean,
            ifWorkday?: boolean,
            ifWordInclude?: string
        } : {}
        const day = new Date().getDay()

        let startedAfter: number;
        if (condition.ifStartedAfter) {
            if (condition.ifStartedAfter.match(/[0-2][0-9][0-5][0-9]/) && condition.ifStartedAfter.length === 4) {
                startedAfter = parseInt(condition.ifStartedAfter);

                if (startedAfter < parseInt(Utilities.formatDate(new Date(), 'JST', 'hhmm'))) {
                    const event = CalendarCreate(req.body);
                    res.send({ status: 'OK', id: event.getId(), condition: { ifStartedAfter : { startedAfter } }});
                }
            }
        }
        if (condition.ifHoliday && (day === 0 || day === 6)) {
            const event = CalendarCreate(req.body);
            res.send({ status: 'OK', id: event.getId(), condition: { ifHoliday : true }});
        }
        if (condition.ifWorkday && (0 < day || day < 6)) {
            const event = CalendarCreate(req.body);
            res.send({ status: 'OK', id: event.getId(), condition: { ifWorkday : true }});
        }
        if (condition.ifWordInclude) {
            const title = req.body['title'] as string;
            if (title.includes(condition.ifWordInclude)) {
                const event = CalendarCreate(req.body);
                res.send({ status: 'OK', id: event.getId(), condition: { ifWordInclude : condition.ifWordInclude }});
            }
        }
        process.log({ status: 'No event copied' });
        res.send({ status: 'No event copied' });
    })
    return app.listen(e);
}

function CalendarCreate(option: any) {
    process.log({ CalendarCreate: option });
    return CalendarApp.createEvent(option['title'] as string,
        option['startTime'],
        option['endTime'],
        {
            description: option['description']
        }
    );
}

function replay_webApp() {
    const e = process.event.load();
    const output = webApp(e);
    return output;
}