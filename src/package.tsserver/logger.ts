import {TsLogger} from "./types";

export class Logger {

    constructor(public readonly tsLogger: TsLogger) {
    }

    info(message?:string | boolean) {
        if (typeof message === 'string') {
            this.tsLogger.info(`Logger: ${message}`)
        }
        if (typeof message === 'boolean') {
            this.tsLogger.info(`Logger: ${String(message)}`)
        }
    }
}