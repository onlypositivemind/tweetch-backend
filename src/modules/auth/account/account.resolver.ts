import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/createUser.input'
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'getAllUsers' })
	public async getAllUsers() {
		return this.accountService.getAllUsers()
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public async createUser(@Args('data') input: CreateUserInput): Promise<boolean> {
		return this.accountService.createUser(input)
	}
}
