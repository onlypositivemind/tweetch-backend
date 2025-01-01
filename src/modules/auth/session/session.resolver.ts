import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { GqlContext } from '@/src/shared/types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	// TODO login убрать из возвращаемого типа password
	@Mutation(() => UserModel, { name: 'login' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput
	): Promise<UserModel> {
		return this.sessionService.login(req, input)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}
}
