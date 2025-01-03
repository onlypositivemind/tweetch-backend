import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlContext } from '@/src/shared/types'

import { Authorization, UserAgent } from '../(decorators)'
import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	// TODO login убрать из возвращаемого типа password
	@Mutation(() => UserModel, { name: 'login' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	): Promise<UserModel> {
		return this.sessionService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.logout(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'getCurrentSession' })
	public async getCurrentSession(@Context() { req }: GqlContext): Promise<SessionModel> {
		return this.sessionService.getCurrentSession(req)
	}

	@Authorization()
	@Query(() => [SessionModel], { name: 'getSessions' })
	public async getSessions(@Context() { req }: GqlContext): Promise<SessionModel[]> {
		return this.sessionService.getSessions(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'clearSession' })
	public async clearSession(@Context() { req }: GqlContext): Promise<boolean> {
		return this.sessionService.clearSession(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public async removeSession(
		@Context() { req }: GqlContext,
		@Args('id') sessionId: string
	): Promise<boolean> {
		return this.sessionService.removeSession(req, sessionId)
	}
}
