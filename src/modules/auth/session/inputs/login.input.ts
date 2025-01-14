import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

import { TOTP_CODE_LENGTH } from '@/src/shared/constants'

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	login: string

	@Field()
	@IsString()
	@IsNotEmpty()
	password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Length(TOTP_CODE_LENGTH, TOTP_CODE_LENGTH)
	totpCode?: string
}
