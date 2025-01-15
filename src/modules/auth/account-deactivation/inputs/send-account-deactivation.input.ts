import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'

@InputType()
export class SendAccountDeactivationInput {
	@Field()
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	userEmail: string
}
