import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { SessionMetadata } from '@/src/shared/types'

export const saveSession = (
	req: Request,
	userId: string,
	metadata: SessionMetadata
): Promise<void> =>
	new Promise((resolve, reject) => {
		req.session.userId = userId
		req.session.createdAt = new Date()
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				reject(new InternalServerErrorException('Session save error'))
			}

			resolve()
		})
	})

export const destroySession = (req: Request, configService: ConfigService): Promise<void> =>
	new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				reject(new InternalServerErrorException('Session destroy error'))
			}

			req.res.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))

			resolve()
		})
	})
