import { Request, Response } from '@ts-module-for-gas/gas-http';
import { process } from '@ts-module-for-gas/gas-utilities';
namespace CalendarCopy {
    export type Query = { calendar: 'copy' }
    export type Body = {
        Title: string,
        Description: string,
        StartTime: string,
        EndTime: string,
        ResponseStatus: string,
        EventUrl: string,
        condition: Condition
    }
    export type Condition = {
        ifStartedAfter?: string,
        ifHoliday?: boolean,
        ifWorkday?: boolean,
        ifWordInclude?: string
    }
    export const main = (req: Request<Query, Body>, res: Response) => {
        if (req.body.ResponseStatus === 'Accepted') {
            const condition: Condition = req.body['condition'] ? req.body.condition : {}
            const StartTime = new Date(req.body.StartTime) ? new Date(req.body.StartTime) : dateParse(req.body.StartTime);
            const EndTime = new Date(req.body.EndTime) ? new Date(req.body.EndTime) : dateParse(req.body.EndTime);

            if (condition.ifStartedAfter) {
                let startedAfter: number;
                if (condition.ifStartedAfter.match(/[0-2][0-9][0-5][0-9]/) && condition.ifStartedAfter.length === 4) {
                    startedAfter = parseInt(condition.ifStartedAfter);
                    if (startedAfter <= parseInt(Utilities.formatDate(StartTime, 'JST', 'hhmm'))) {
                        const event = CalendarCreate(req.body as Body, StartTime, EndTime);
                        res.send({ status: 'OK', id: event.getId(), condition: { ifStartedAfter: { startedAfter } } });
                        return
                    }
                }
            }
            if (condition.ifHoliday && (StartTime.getDay() === 0 || StartTime.getDay() === 6)) {
                const event = CalendarCreate(req.body as Body, StartTime, EndTime);
                res.send({ status: 'OK', id: event.getId(), condition: { ifHoliday: true } });
                return
            }
            if (condition.ifWorkday && (0 < StartTime.getDay() && StartTime.getDay() < 6)) {
                const event = CalendarCreate(req.body as Body, StartTime, EndTime);
                res.send({ status: 'OK', id: event.getId(), condition: { ifWorkday: true } });
                return
            }
            if (condition.ifWordInclude) {
                const title = req.body['title'] as string;
                if (title.includes(condition.ifWordInclude)) {
                    const event = CalendarCreate(req.body as Body, StartTime, EndTime);
                    res.send({ status: 'OK', id: event.getId(), condition: { ifWordInclude: condition.ifWordInclude } });
                    return
                }
            }
        }

        process.log({ status: 'No event copied' });
        res.send({ status: 'No event copied' });
        return
    }

    export function CalendarCreate(option: { Title: string, Description: string }, startTime: Date, endTime: Date) {
        process.log({ CalendarCreate: option });
        return CalendarApp.createEvent(option.Title,
            startTime,
            endTime,
            {
                description: option.Description
            }
        );
    }

    export function dateParse(str: string) {
        const dateTime = new Date(str.replace('at', '').replace('AM', '').replace('PM', ''))
        if (str.includes('PM')) {
            return new Date(
                dateTime.getFullYear(),
                dateTime.getMonth(),
                dateTime.getDate(),
                dateTime.getHours() + 12,
                dateTime.getMinutes(),
                dateTime.getSeconds()
            )
        } else {
            return new Date();
        }
    }
}
const calendarCopy = CalendarCopy.main
export default calendarCopy;