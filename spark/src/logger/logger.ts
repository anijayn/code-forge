const PREFIX = "[SPARK]";

const format = (level: string, message: string) =>
  `${new Date().toISOString()} ${PREFIX} ${level} ${message}`;

export const logger = {
  log(message: string) {
    console.log(format("INFO", message));
  },

  warn(message: string) {
    console.warn(format("WARN", message));
  },

  error(message: string, error?: unknown) {
    const output = format("ERROR", message);

    if (error instanceof Error) {
      console.error(output, error.stack);
      return;
    }

    console.error(output, error);
  },
};
