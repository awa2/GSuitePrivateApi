import { WebApp } from '@ts-module-for-gas/gas-http';
import { process} from '@ts-module-for-gas/gas-utilities';

import { calendarCopy } from './web/calendarCopy';

// Web Application Entry Point
export function webApp(e: any) {
    process.event.store(e);
    process.log(e);

    const app = new WebApp();

    // Web Application Middleware
    app.post({ calendar: 'copy' }, calendarCopy);
    return app.listen(e);
}

// Reporoduction Testing
// NOTE : This function regenerates an event which received at last time and 
//        exec webApp() function. It uses for debug.
function replay_webApp() {
    const e = process.event.load();
    const output = webApp(e);
    return output;
}