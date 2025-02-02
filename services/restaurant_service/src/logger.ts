import { createLogger, format, transports } from "winston";

const { combine, printf, timestamp } = format;

const transportCombined = new transports.File({
  filename: "logs/combined.log"
});
const transportConsole = new transports.Console();
const transportError = new transports.File({
  filename: "logs/error.log",
  level: "error"
});

const timestampFormat = "YYYY-MM-DD HH:mm:ss";

const uppercaseLevelFormat = format(info => ({
  ...info,
  level: info.level.toUpperCase()
}));

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}] : ${message}`;
});

const logger = createLogger({
  format: combine(
    uppercaseLevelFormat(),
    timestamp({
      format: timestampFormat
    }),
    logFormat
  ),
  level: "info",
  transports: [transportCombined, transportConsole, transportError]
});

export default logger;
