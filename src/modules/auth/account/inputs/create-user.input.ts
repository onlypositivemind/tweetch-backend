import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

import { PASSWORD_MIN_LENGTH, USERNAME_REX_EXP } from '@/src/shared/constants'

@InputType()
export class CreateUserInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(USERNAME_REX_EXP)
	username: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(PASSWORD_MIN_LENGTH)
	password: string
}
