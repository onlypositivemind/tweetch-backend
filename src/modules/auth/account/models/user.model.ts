import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public email: string

	@Field(() => String)
	public password: string

	@Field(() => String)
	public username: string

	@Field(() => String)
	public displayName: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => ID)
	public updatedAt: Date

	@Field(() => String, { nullable: true })
	public avatar: string

	@Field(() => String, { nullable: true })
	public bio: string
}
