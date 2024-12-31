import { ConfigService } from '@nestjs/config'

import { Environment } from '../enums'

export const getIsDevelopment = (configService: ConfigService): boolean =>
	configService.getOrThrow<string>('NODE_ENV') === Environment.DEVELOPMENT
