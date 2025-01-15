import { v4 as uuidv4 } from 'uuid'

import { Token, TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

interface GenerateTokenParams {
	userId: string
	tokenType: TokenType
	prismaService: PrismaService
	isUuid?: boolean
}

const getRandomToken = (): string =>
	Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000).toString()

const getExpiresIn = (minutes = 5): Date => new Date(new Date().getTime() + minutes * 60 * 1000)

export const generateToken = async ({
	userId,
	tokenType,
	prismaService,
	isUuid = true
}: GenerateTokenParams): Promise<Token> => {
	const token = isUuid ? uuidv4() : getRandomToken()
	const expiresIn = getExpiresIn()

	const existingToken = await prismaService.token.findFirst({
		where: {
			type: tokenType,
			user: {
				id: userId
			}
		}
	})
	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})
	}

	return prismaService.token.create({
		data: {
			token,
			expiresIn,
			type: tokenType,
			user: {
				connect: {
					id: userId
				}
			}
		},
		include: {
			user: true
		}
	})
}
