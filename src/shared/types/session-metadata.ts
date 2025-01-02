export interface Device {
	os: string
	type: string
	browser: string
}

export interface Location {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface SessionMetadata {
	ip: string
	device: Device
	location: Location
}
