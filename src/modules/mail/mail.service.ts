import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import type { SessionMetadata } from '@/src/shared/types'

import {
	AccountDeactivation,
	AccountDeletion,
	AccountVerification,
	PasswordRecovery
} from './templates'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	private async sendMail(email: string, subject: string, html: string): Promise<void> {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}

	public async sendAccountVerificationToken(email: string, token: string): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(AccountVerification({ domain, token }))

		return this.sendMail(email, 'Account verification', html)
	}

	public async sendPasswordRecoveryToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(PasswordRecovery({ domain, token, metadata }))

		return this.sendMail(email, 'Password recovery', html)
	}

	public async sendAccountDeactivationToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	): Promise<void> {
		const html = await render(AccountDeactivation({ token, metadata }))

		return this.sendMail(email, 'Account deactivation', html)
	}

	public async sendAccountDeletion(email: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(AccountDeletion({ domain }))

		return this.sendMail(email, 'Account deleted', html)
	}
}
