import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Length } from 'class-validator'

import { TOTP_CODE_LENGTH } from '@/src/shared/constants'

@InputType()
export class EnableTotpInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	secret: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Length(TOTP_CODE_LENGTH, TOTP_CODE_LENGTH)
	totpCode: string
}
