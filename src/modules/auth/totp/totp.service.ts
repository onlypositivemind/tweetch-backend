import { BadRequestException, Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import * as QRCode from 'qrcode'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { getTotp } from '../(utils)'

import { EnableTotpInput } from './inputs'
import { TotpModel } from './models'

@Injectable()
export class TotpService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getTotpSecret(userEmail: string): Promise<TotpModel> {
		const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24)

		const totp = getTotp(userEmail, secret)

		const totpAuthUrl = totp.toString()
		const qrcodeUrl = await QRCode.toDataURL(totpAuthUrl)

		return { secret, qrcodeUrl }
	}

	public async enableTotp(userEmail: string, input: EnableTotpInput): Promise<boolean> {
		const { secret, totpCode } = input

		const totp = getTotp(userEmail, secret)

		const tokenDelta = totp.validate({ token: totpCode })
		if (tokenDelta === null) {
			throw new BadRequestException('Wrong code')
		}

		await this.prismaService.user.update({
			where: {
				email: userEmail
			},
			data: {
				isTotpEnabled: true,
				totpSecret: secret
			}
		})

		return true
	}

	public async disableTotp(userId: string): Promise<boolean> {
		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				isTotpEnabled: false,
				totpSecret: null
			}
		})

		return true
	}
}
