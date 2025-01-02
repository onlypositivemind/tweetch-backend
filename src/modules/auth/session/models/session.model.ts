import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Device, Location, SessionMetadata } from '@/src/shared/types'

@ObjectType()
export class DeviceModel implements Device {
	@Field(() => String)
	os: string

	@Field(() => String)
	type: string

	@Field(() => String)
	browser: string
}

@ObjectType()
export class LocationModel implements Location {
	@Field(() => String)
	country: string

	@Field(() => String)
	city: string

	@Field(() => Number)
	latitude: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
	@Field(() => String)
	ip: string

	@Field(() => DeviceModel)
	device: DeviceModel

	@Field(() => LocationModel)
	location: LocationModel
}

@ObjectType()
export class SessionModel {
	@Field(() => ID)
	id: string

	@Field(() => String)
	userId: string

	@Field(() => String)
	createdAt: string

	@Field(() => SessionMetadataModel)
	metadata: SessionMetadataModel
}
