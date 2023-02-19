const getLogDate = () => {
  return new Date().toISOString().slice(11);
};

export class Logger {
  constructor(private context: string) {}

  info(message: string, details?: any) {
    console.log(`${getLogDate()} (${this.context}) [info] ${message}`);
    if (details) {
      console.log(details);
    }
  }

  warn(message: string, details?: any) {
    console.warn(`${getLogDate()} (${this.context}) [warn] ${message}`);
    if (details) {
      console.warn(details);
    }
  }

  error(message: string, error: any) {
    console.error(`${getLogDate()} (${this.context}) [error] ${message}`);
    if (error) {
      console.error(error);
    }
  }
}
