import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '../decorators'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

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
}
