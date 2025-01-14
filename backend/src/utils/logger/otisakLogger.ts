import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';
import { PrismaClient } from '@prisma/client';
import { LOG_CODE_LIBRARY, LogCodeDefinition } from './logDefinitions';

class PrismaTransport extends Transport {
  private prisma: PrismaClient;

  constructor(opts?: any) {
    super(opts);
    this.prisma = new PrismaClient();
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    try {
      await this.prisma.log.create({
        data: {
          level: info.level,
          message: info.message,
          code: info.code,
          meta: info.meta || {},
        },
      });
    } catch (error) {
      console.error('[WINSTON]: Error writing log to the database:', error);
    }

    if (callback) {
      callback();
    }
  }
}

export const requestDataFormat = format((info: any) => {
  if (info.meta && info.meta.req) {
    const req = info.meta.req;
    const { ip, path, method, user } = req;

    info.meta = {
      ...info.meta,
      ip: ip || null,
      path: path || req.url || null,
      method: method || null,
      user_agent: req.get('User-Agent') || null,
      user_id: user?.id || null,
    };

    delete info.meta.req;
  }
  return info;
});

export const logCodeFormat = format((info: any) => {
  const { log_code } = info;

  if (log_code && LOG_CODE_LIBRARY[log_code]) {
    const { level, message, description, code } = LOG_CODE_LIBRARY[log_code];
    info.level = level;
    info.message = message;
    info.code = code;
    info.log_key = log_code;
    info.meta = {
      ...info.meta,
      description,
    };

    delete info.log_code;
  }

  return info;
});

export const OtisakLogger = createLogger({
  level: 'info',
  format: format.combine(
    requestDataFormat(),
    logCodeFormat(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, log_key, timestamp }) => {
          return `[${timestamp}] ${level}: ${message} [${log_key}]`;
        })
      ),
    }),
    new PrismaTransport(),
  ],
});


export const logCode = (
  logDefOrKey: LogCodeDefinition | string,
  meta?: Record<string, any>
) => {
  let keyToUse: string | undefined;

  if (typeof logDefOrKey === 'string') {
    keyToUse = logDefOrKey;
  } else {
    keyToUse = Object.keys(LOG_CODE_LIBRARY).find(
      (k) => LOG_CODE_LIBRARY[k] === logDefOrKey
    );
  }

  if (!keyToUse) {
    OtisakLogger.warn(
      '[LOGGER] Could not find the matching key in LOG_CODE_LIBRARY for: ' +
        JSON.stringify(logDefOrKey)
    );
    return;
  }

  OtisakLogger.log({
    level: 'info',
    message: '...',
    log_code: keyToUse,
    meta,
  });
};
