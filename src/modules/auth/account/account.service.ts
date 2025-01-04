import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { MailService } from '@/src/modules/mail/mail.service'

import { generateToken, getSessionMetadata, saveSession } from '../(utils)'

import { CreateUserInput } from './inputs/create-user.input'
import { VerifyAccountInput } from './inputs/verify-account.input'
import { UserModel } from './models/user.model'

@Injectable()
export class AccountService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async getMe(userId: UserModel['id']): Promise<UserModel> {
		return this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
	}

	public async sendAccountVerificationToken(userId: string, email: string) {
		const verificationToken = await generateToken(
			TokenType.EMAIL_VERIFY,
			userId,
			this.prismaService
		)

		await this.mailService.sendAccountVerificationToken(email, verificationToken.token)

		return true
	}

	public async createUser(input: CreateUserInput): Promise<boolean> {
		const { email, username, password } = input

		const isUsernameExist = Boolean(
			await this.prismaService.user.findUnique({
				where: {
					username
				}
			})
		)
		if (isUsernameExist) {
			throw new ConflictException('Username cannot be used. Please choose another username')
		}

		const isEmailExist = Boolean(
			await this.prismaService.user.findUnique({
				where: {
					email
				}
			})
		)
		if (isEmailExist) {
			throw new ConflictException('A user is already registered with this e-mail address')
		}

		const hashPassword = await hash(password)

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: hashPassword,
				displayName: username
			}
		})

		await this.sendAccountVerificationToken(user.id, user.email)

		return true
	}

	public async verifyAccount(
		req: Request,
		input: VerifyAccountInput,
		userAgent: string
	): Promise<UserModel> {
		const { token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		})
		if (!existingToken) {
			throw new NotFoundException('The token was not found')
		}
		const isExpired = new Date(existingToken.expiresIn) < new Date()
		if (isExpired) {
			throw new BadRequestException('The token has expired')
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		const metadata = getSessionMetadata(req, userAgent)

		await saveSession(req, user.id, metadata)

		return user
	}
}
