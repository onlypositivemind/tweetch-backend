import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'

import { destroySession, getSessionMetadata, getTotp, saveSession } from '../(utils)'
import { AccountService } from '../account/account.service'
import { UserModel } from '../account/models'

import { LoginInput } from './inputs'
import { SessionModel } from './models'

const LOGIN_ERROR_MESSAGE = 'The login and/or password you specified are not correct'

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly accountService: AccountService,
		private readonly configService: ConfigService
	) {}

	// TODO login убрать из возвращаемого типа password
	public async login(req: Request, input: LoginInput, userAgent: string): Promise<UserModel> {
		const { login, password, totpCode } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [{ username: { equals: login } }, { email: { equals: login } }]
			}
		})
		if (!user) {
			throw new UnauthorizedException(LOGIN_ERROR_MESSAGE)
		}

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) {
			throw new UnauthorizedException(LOGIN_ERROR_MESSAGE)
		}

		if (!user.isEmailVerified) {
			await this.accountService.sendAccountVerificationToken(user.id, user.email)

			throw new BadRequestException(
				'The account has not been verified. Please check your email for confirmation.'
			)
		}

		if (user.isTotpEnabled) {
			if (!totpCode) {
				throw new BadRequestException('A code is required to complete authorization.')
			}

			const totp = getTotp(user.email, user.totpSecret)

			const tokenDelta = totp.validate({ token: totpCode })
			if (tokenDelta === null) {
				throw new BadRequestException('Wrong code')
			}
		}

		const metadata = getSessionMetadata(req, userAgent)

		await saveSession(req, user.id, metadata)

		return user
	}

	public async logout(req: Request): Promise<boolean> {
		await destroySession(req, this.configService)

		return true
	}

	public async getCurrentSession(req: Request): Promise<SessionModel> {
		const sessionId = req.session.id
		const sessionFolder = this.configService.getOrThrow<string>('SESSION_FOLDER')

		const sessionData = await this.redisService.get(`${sessionFolder}${sessionId}`)
		const session = JSON.parse(sessionData)

		return {
			...session,
			id: sessionId
		}
	}

	// TODO return type
	public async getSessions(req: Request): Promise<SessionModel[]> {
		const userId = req.session.userId
		if (!userId) {
			throw new NotFoundException('The user was not found')
		}

		const keys = await this.redisService.keys('*')
		if (!keys) {
			return []
		}

		const userSessions = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session = JSON.parse(sessionData)

				if (session.userId === userId) {
					const id = key.split(':')[1]

					userSessions.push({
						...session,
						id
					})
				}
			}
		}

		return userSessions
			.sort((a, b) => b.createdAt - a.createdAt)
			.filter(session => session.id !== req.session.id)
	}

	public async clearSession(req: Request): Promise<boolean> {
		const sessionName = this.configService.getOrThrow<string>('SESSION_NAME')
		req.res.clearCookie(sessionName)

		return true
	}

	public async removeSession(req: Request, sessionId: string): Promise<boolean> {
		if (req.session.id === sessionId) {
			throw new ConflictException('The current session cannot be deleted')
		}

		const sessionFolder = this.configService.getOrThrow<string>('SESSION_FOLDER')
		await this.redisService.del(`${sessionFolder}${sessionId}`)

		return true
	}
}
