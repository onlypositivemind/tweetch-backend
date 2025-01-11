import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization, Authorized } from '../(decorators)'

import { EnableTotpInput } from './inputs'
import { TotpModel } from './models'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, { name: 'getTotpSecret' })
	public async getTotpSecret(@Authorized('email') userEmail: string): Promise<TotpModel> {
		return this.totpService.getTotpSecret(userEmail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'enableTotp' })
	public async enableTotp(
		@Authorized('email') userEmail: string,
		@Args('data') input: EnableTotpInput
	): Promise<boolean> {
		return this.totpService.enableTotp(userEmail, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'disableTotp' })
	public async disableTotp(@Authorized('id') userId: string): Promise<boolean> {
		return this.totpService.disableTotp(userId)
	}
}
