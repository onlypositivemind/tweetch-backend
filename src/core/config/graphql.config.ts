import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { getIsDevelopment } from '@/src/shared/utils'

export const getGraphQLConfig = (configService: ConfigService): ApolloDriverConfig => ({
	playground: getIsDevelopment(configService),
	path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
	autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.graphql'),
	sortSchema: true,
	context: ({ req, res }) => ({ req, res })
})
