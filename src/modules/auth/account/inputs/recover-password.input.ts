import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class RecoverPasswordInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string
}
