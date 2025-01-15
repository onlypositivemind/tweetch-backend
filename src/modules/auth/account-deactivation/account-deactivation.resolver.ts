import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import { GqlContext } from '@/src/shared/types'

import { Authorization, Authorized, UserAgent } from '../(decorators)'

import { AccountDeactivationService } from './account-deactivation.service'
import { DeactivateAccountInput } from './inputs'

@Resolver('AccountDeactivation')
export class AccountDeactivationResolver {
	constructor(private readonly accountDeactivationService: AccountDeactivationService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'deactivateAccount' })
	public async deactivateAccount(
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	): Promise<boolean> {
		return this.accountDeactivationService.deactivateAccount(req, input, user, userAgent)
	}
}
