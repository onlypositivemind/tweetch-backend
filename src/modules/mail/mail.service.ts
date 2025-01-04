import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { AccountVerification } from './templates'

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
}
