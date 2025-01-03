import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsUUID } from 'class-validator'

@InputType()
export class VerifyAccountInput {
	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	token: string
}
