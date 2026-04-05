import { join } from 'path';
import { Logger } from './utils/logger';

export const STATIC_DIRECTORY =
  process.env.STATIC_DIRECTORY || join(__dirname, '../../', 'static');
export const UART_SERIAL = process.env.UART_SERIAL === 'true';
export const SEND_DATA = process.env.SEND_DATA === 'false' ? false : true;
export const MQTT_HOST = process.env.MQTT_HOST ?? 'mqtt://localhost:1883';

const logger = new Logger('env');

logger.info(`STATIC_DIRECTORY=${STATIC_DIRECTORY}`);
logger.info(`UART_SERIAL=${UART_SERIAL}`);
logger.info(`SEND_DATA=${SEND_DATA}`);
logger.info(`MQTT_HOST=${MQTT_HOST}`);
