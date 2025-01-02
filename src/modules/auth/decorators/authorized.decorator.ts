import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import type { GqlContext } from '@/src/shared/types'

export const Authorized = createParamDecorator((key: keyof User, ctx: ExecutionContext) => {
	const user: User =
		ctx.getType() === 'http'
			? // TODO types
				// @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
				ctx.switchToHttp().getRequest<Request>().user
			: // TODO types
				// @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
				GqlExecutionContext.create(ctx).getContext<GqlContext>().req.user

	return key ? user[key] : user
})
