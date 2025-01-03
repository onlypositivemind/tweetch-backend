import { Module } from '@nestjs/common'

import { AccountService } from '../account/account.service'

import { SessionResolver } from './session.resolver'
import { SessionService } from './session.service'

@Module({
	providers: [SessionResolver, SessionService, AccountService]
})
export class SessionModule {}
