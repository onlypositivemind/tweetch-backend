import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlContext } from '@/src/shared/types'

import { Authorization, Authorized, UserAgent } from '../(decorators)'

import { AccountService } from './account.service'
import {
	ChangePasswordByRecoveryInput,
	CreateUserInput,
	RecoverPasswordInput,
	VerifyAccountInput
} from './inputs'
import { UserModel } from './models'

@Resolver('Account')
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'getMe' })
	public async getMe(@Authorized('id') userId: string): Promise<UserModel> {
		return this.accountService.getMe(userId)
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async createUser(@Args('data') input: CreateUserInput): Promise<boolean> {
		return this.accountService.createUser(input)
	}

	@Mutation(() => UserModel, { name: 'verifyAccount' })
	public async verifyAccount(
		@Context() { req }: GqlContext,
		@Args('data') input: VerifyAccountInput,
		@UserAgent() userAgent: string
	): Promise<UserModel> {
		return this.accountService.verifyAccount(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'recoverPassword' })
	public async recoverPassword(
		@Context() { req }: GqlContext,
		@Args('data') input: RecoverPasswordInput,
		@UserAgent() userAgent: string
	): Promise<boolean> {
		return this.accountService.recoverPassword(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'changePasswordByRecovery' })
	public async changePasswordByRecovery(
		@Args('data') input: ChangePasswordByRecoveryInput
	): Promise<boolean> {
		return this.accountService.changePasswordByRecovery(input)
	}
}
