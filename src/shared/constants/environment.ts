import { Environment } from '../enums'

export const isDevelopment = process.env.NODE_ENV === Environment.DEVELOPMENT
