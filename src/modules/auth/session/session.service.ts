import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'

const LOGIN_ERROR_MESSAGE = 'The login and/or password you specified are not correct'

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {}

	// TODO login убрать из возвращаемого типа password
	public async login(req: Request, input: LoginInput): Promise<UserModel> {
		const { login, password } = input

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

		return new Promise((resolve, reject) => {
			req.session.userId = user.id
			req.session.createdAt = new Date()

			req.session.save(err => {
				if (err) {
					reject(new InternalServerErrorException('Session save error'))
				}

				resolve(user)
			})
		})
	}

	public async logout(req: Request): Promise<boolean> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					reject(new InternalServerErrorException('Session destroy error'))
				}

				req.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))

				resolve(true)
			})
		})
	}
}
