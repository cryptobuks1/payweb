
/**
 * logger 
 * logger is used for initialize logger implementation .
 * @package logger
 * @subpackage sources/services/logger
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

const { createLogger, format, transports } = require('winston');
const { printf, splat } = format;

import { GetCallerModule } from "caller-module";
const ASYNC_TIMEOUT = 1000;
const STACK_LEVEL = 3;


export class Logger {
    constructor() {
        this.logFormat = printf(info => {
            if (info instanceof Error) {
                //return `${info.timestamp} ${info.level} ${info.message} : ${info.meta.stack}`;
                return Object.assign({}, info, {
                    stack: info.stack,
                    message: info.message
                })
            }
            return `${info.timestamp} ${info.level}: ${info.message}`;
        });
        this.logger =
            createLogger({
                format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    format.colorize(),
                    format.errors({ stack: true }),
                    splat(),
                    this.logFormat
                ),
                transports: [
                    new transports.File({
                        filename: './logs/all-logs.log',
                        level: 'debug',
                        json: true,
                        maxsize: 5242880,
                        maxFiles: 5,
                    }),
                    new transports.Console({
                        label: 'testLog',
                        level: 'debug',
                        handleExceptions: false,
                        json: false,
                        colorize: true
                    }),
                ],
            });
        this.moduleToLogLevel = [];
        setTimeout(() => {
            this._getAllModuleToLogLevel();
        }, ASYNC_TIMEOUT)
        this.logLevel = { 'off': 0, 'error': 1, 'info': 2, 'warn': 3, 'debug': 4 };
    }

    error(message) {
        this.moduleLogObj = this._getModuleLogStatus(this._getCurrentModuleInfo());

        if (this.moduleLogObj && this.moduleLogObj.log_level >= this.logLevel.error) {
            this.logger.log({
                level: 'error',
                message: `File Location :  ${this._getCurrentModuleInfo().moduleName} -- Line Number :  ${this._getCurrentModuleInfo().moduleName.lineNo} -- Description :  ${message}`
            })
        }
    }

    debug(message) {
        this.moduleLogObj = this._getModuleLogStatus(this._getCurrentModuleInfo());
        if (this.moduleLogObj && this.moduleLogObj.log_level >= this.logLevel.debug) {
            this.logger.log({
                level: 'debug',
                message: `File Location :  ${this.moduleLogObj.module} -- Line Number :  ${this._getCurrentModuleInfo().lineNo} -- Description :  ${message}`
            })
        }
    }

    warn(message) {
        this.moduleLogObj = this._getModuleLogStatus(this._getCurrentModuleInfo());
        if (this.moduleLogObj && this.moduleLogObj.log_level >= this.logLevel.warn) {
            this.logger.log({
                level: 'warn',
                message: `File Location :  ${this.moduleLogObj.module} -- Line Number :  ${this._getCurrentModuleInfo().lineNo} -- Description :  ${message}`
            })
        }
    }

    info(message) {
        this.moduleLogObj = this._getModuleLogStatus(this._getCurrentModuleInfo());
        if (this.moduleLogObj && this.moduleLogObj.log_level >= this.logLevel.info) {
            this.logger.log({
                level: 'info',
                message: `File Location :  ${this.moduleLogObj.module} -- Line Number :  ${this._getCurrentModuleInfo().lineNo} -- Description :  ${message}`
            })
        }
    }

    _getAllModuleToLogLevel() {
        this.moduleToLogLevel = global.moduleToLogLevel;
    }

    _getCurrentModuleInfo() {
        let moduleLogObj = {};
        try {
            const mainFileName = (GetCallerModule(STACK_LEVEL).callSite.getFileName()).substring(0, (GetCallerModule(STACK_LEVEL).callSite.getFileName()).lastIndexOf('.'));
            let opsys = process.platform;
            if (opsys == "win32" || opsys == "win64") {
              const pathHolder = mainFileName.split("\\sources\\services");
              moduleLogObj['lineNo'] = GetCallerModule(STACK_LEVEL).callSite.getLineNumber();
              moduleLogObj['moduleName'] = `${(pathHolder[1]) ? pathHolder[1].substring(1).replace(/\\/g, ".") : ''}`;
            } else if (opsys == "linux") {
              const pathHolder = mainFileName.split('app');
              moduleLogObj['lineNo'] = GetCallerModule(STACK_LEVEL).callSite.getLineNumber();
              moduleLogObj['moduleName'] = `${(pathHolder[1]) ? pathHolder[1].substring(1).replace(/\//g, ".") : ''}`;
            } else {
              const pathHolder = mainFileName.split('/sources/services');
              moduleLogObj['lineNo'] = GetCallerModule(STACK_LEVEL).callSite.getLineNumber();
              moduleLogObj['moduleName'] = `${(pathHolder[1]) ? pathHolder[1].substring(1).replace(/\//g, ".") : ''}`;
            }
        }
        catch (err) {
            throw new Error('Failed to get logger file name');
        }
        return moduleLogObj;
    }

    _getModuleLogStatus(moduleObj) {
        return global.moduleToLogLevel.find(({ module }) => module === moduleObj.moduleName);
    }

}