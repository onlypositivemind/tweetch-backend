import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Injectable()
export class AccountService {
	constructor(private readonly prismaService: PrismaService) {}

	public async getMe(userId: UserModel['id']): Promise<UserModel> {
		return this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
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

		await this.prismaService.user.create({
			data: {
				username,
				email,
				password: hashPassword,
				displayName: username
			}
		})

		return true
	}
}
