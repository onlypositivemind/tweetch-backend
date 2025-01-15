import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

import { ACCOUNT_DEACTIVATION_CODE_LENGTH } from '@/src/shared/constants'

@InputType()
export class DeactivateAccountInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	password: string

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Length(ACCOUNT_DEACTIVATION_CODE_LENGTH, ACCOUNT_DEACTIVATION_CODE_LENGTH)
	code?: string
}
