import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountDeactivationModule } from '@/src/modules/auth/account-deactivation/account-deactivation.module'
import { AccountModule } from '@/src/modules/auth/account/account.module'
import { SessionModule } from '@/src/modules/auth/session/session.module'
import { TotpModule } from '@/src/modules/auth/totp/totp.module'
import { MailModule } from '@/src/modules/mail/mail.module'
import { isDevelopment } from '@/src/shared/constants'

import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !isDevelopment,
			isGlobal: true
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		PrismaModule,
		RedisModule,
		MailModule,
		AccountModule,
		SessionModule,
		TotpModule,
		AccountDeactivationModule
	]
})
export class CoreModule {}
