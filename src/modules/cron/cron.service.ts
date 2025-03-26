import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/mail/mail.service'

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7))

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})

		for await (const account of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(account.email)
		}
	}
}
