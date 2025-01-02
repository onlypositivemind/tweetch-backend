import 'express-session'

import { SessionMetadata } from './session-metadata'

declare module 'express-session' {
	interface SessionData {
		metadata: SessionMetadata
		userId?: string
		createdAt?: Date | string
	}
}
