import { TOTP } from 'otpauth'

import { TOTP_CODE_LENGTH } from '@/src/shared/constants'

export const getTotp = (userEmail: string, secret: string) =>
	new TOTP({
		secret,
		label: userEmail,
		issuer: 'Tweetch',
		algorithm: 'SHA1',
		digits: TOTP_CODE_LENGTH
	})
