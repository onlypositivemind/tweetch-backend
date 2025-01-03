import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { GqlContext } from '@/src/shared/types'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const gqlCtx = GqlExecutionContext.create(ctx)
		const req = gqlCtx.getContext<GqlContext>().req

		if (typeof req.session.userId === 'undefined') {
			throw new UnauthorizedException('You need to log in')
		}

		// TODO types
		// @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
		req.user = await this.prismaService.user.findUnique({
			where: {
				id: req.session.userId
			}
		})

		return true
	}
}
