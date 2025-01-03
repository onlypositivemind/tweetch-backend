import { v4 as uuidv4 } from 'uuid'

import { Token, TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'

const getRandomToken = (): string =>
	Math.floor(Math.random() * (1_000_000 - 100_000) + 100_000).toString()

const getExpiresIn = (minutes = 5): Date => new Date(new Date().getTime() + minutes * 60 * 1000)

export const generateToken = async (
	type: TokenType,
	userId: string,
	prismaService: PrismaService,
	isUuid = false
): Promise<Token> => {
	const token = isUuid ? uuidv4() : getRandomToken()
	const expiresIn = getExpiresIn()

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
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
			type,
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
