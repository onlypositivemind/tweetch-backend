import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

import { PASSWORD_MIN_LENGTH } from '@/src/shared/constants'

@InputType()
export class ChangePasswordByRecoveryInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(PASSWORD_MIN_LENGTH)
	password: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	token: string
}
