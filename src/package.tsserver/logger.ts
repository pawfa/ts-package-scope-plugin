import {TsLogger} from "./types";

export class Logger {

    constructor(public readonly tsLogger: TsLogger) {
    }

    info(message?:string | boolean | number, scope?: string) {
        const prefix = scope ? `Logger [${scope}]: `: 'Logger: '
        if (typeof message === 'string' || typeof message === 'number') {
            this.tsLogger.info(`${prefix} ${message}`)
        }
        if (typeof message === 'boolean') {
            this.tsLogger.info(`${prefix} ${String(message)}`)
        }
    }
}