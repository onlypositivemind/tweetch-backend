import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { Token, TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/mail/mail.service'

import { destroySession, generateToken, getSessionMetadata } from '../(utils)'

import { DeactivateAccountInput, SendAccountDeactivationInput } from './inputs'

@Injectable()
export class AccountDeactivationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService
	) {}

	public async sendAccountDeactivation(
		req: Request,
		input: SendAccountDeactivationInput,
		userAgent: string
	): Promise<true> {
		const { userId, userEmail } = input

		const deactivationToken = await generateToken({
			userId,
			tokenType: TokenType.ACCOUNT_DEACTIVATION,
			prismaService: this.prismaService,
			isUuid: false
		})

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendAccountDeactivationToken(
			userEmail,
			deactivationToken.token,
			metadata
		)

		return true
	}

	private async validateDeactivationToken(token: string): Promise<Token> {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.ACCOUNT_DEACTIVATION
			}
		})
		if (!existingToken) {
			throw new NotFoundException('The token was not found')
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()
		if (isExpired) {
			throw new BadRequestException('The token has expired')
		}

		return existingToken
	}

	public async deactivateAccount(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	): Promise<true> {
		if (user.email !== input.email) {
			throw new BadRequestException('Invalid email')
		}

		const isValidPassword = await verify(user.password, input.password)
		if (!isValidPassword) {
			throw new BadRequestException('Invalid password')
		}

		if (!input.code) {
			await this.sendAccountDeactivation(
				req,
				{ userId: user.id, userEmail: user.email },
				userAgent
			)

			throw new BadRequestException('Need deactivation code sent by email')
		}

		const existingToken = await this.validateDeactivationToken(input.code)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.ACCOUNT_DEACTIVATION
			}
		})

		await destroySession(req, this.configService)

		return true
	}
}
