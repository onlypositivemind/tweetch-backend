import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

import { GqlContext } from '@/src/shared/types'

export const UserAgent = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	if (ctx.getType() === 'http') {
		return ctx.switchToHttp().getRequest<Request>()['headers']['user-agent']
	}

	return GqlExecutionContext.create(ctx).getContext<GqlContext>().req.headers['user-agent']
})
