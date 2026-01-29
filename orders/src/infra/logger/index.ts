import pino from 'pino'
import { env } from '../env'

export const logger = pino({
  level:
    env.NODE_ENV === 'test'
      ? 'silent'
      : env.NODE_ENV === 'prod'
      ? 'info'
      : 'debug',
  transport:
    env.NODE_ENV !== 'prod' && env.NODE_ENV !== 'test'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:mm:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
})
