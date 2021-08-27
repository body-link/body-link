import { hostname } from 'os';
import { dedent } from 'ts-dedent';
import { markdownv2 as f } from 'telegram-format';
import { isDefined } from '@body-link/type-guards';
import { createContextToken, createReader } from '@marblejs/core';
import { config, createLogger, format, Logger, transports } from 'winston';
import TelegramLogger from 'winston-telegram';
import { MongoDB } from 'winston-mongodb';
import { getState } from '../../state';
import { convertReplyToLogEntry, getReplyMarkdownV2, Reply } from '../../data/Reply';

export class Assistant {
  private _hostname: string = hostname();

  private _logger: Logger = createLogger({
    levels: config.npm.levels,
    level: 'info',
    format: format.combine(format.metadata(), format.json()),
    transports: [new MongoDB({ db: getState().mongoURI, options: { useUnifiedTopology: true } })],
  });

  public constructor() {
    const { isDev, telegram } = getState();
    if (isDev) {
      this._logger.add(new transports.Console());
    }
    if (isDefined(telegram)) {
      this._logger.add(
        new TelegramLogger({
          token: telegram.token,
          chatId: telegram.adminID,
          parseMode: f.parse_mode,
          formatMessage: (options) => {
            const { reply, machine } = options.metadata as { machine: string; reply: Reply };
            const header = dedent`
            ${f.monospace(`[${options.level}]`)} ${f.escape(machine)}
            ${f.escape(`${reply.entry.subject} → ${reply.entry.action}`)}
          `;
            return dedent`
            ${header}\n
            ${getReplyMarkdownV2(reply)}
          `;
          },
        })
      );
    }
  }

  public reply = (reply: Reply): void => {
    this._logger.log({
      ...convertReplyToLogEntry(reply),
      machine: this._hostname,
      reply,
    });
  };
}

// eslint-disable-next-line @rushstack/typedef-var
export const AssistantToken = createContextToken<Assistant>('Assistant');

// eslint-disable-next-line @rushstack/typedef-var
export const assistant = createReader(() => new Assistant());
