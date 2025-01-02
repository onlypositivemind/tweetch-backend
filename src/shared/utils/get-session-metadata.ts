import { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import { isDevelopment } from '../constants'
import { SessionMetadata } from '../types'

// TODO
// eslint-disable-next-line @typescript-eslint/no-require-imports
import DeviceDetector = require('device-detector-js')

// TODO
// eslint-disable-next-line @typescript-eslint/no-require-imports
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

const getIp = (req: Request) => {
	if (isDevelopment) {
		return '173.166.164.121'
	}

	if (Array.isArray(req.headers['cf-connecting-ip'])) {
		return req.headers['cf-connecting-ip'][0]
	}

	if (req.headers['cf-connecting-ip']) {
		return req.headers['cf-connecting-ip']
	}

	return typeof req.headers['x-forwarded-for'] === 'string'
		? req.headers['x-forwarded-for'].split(',')[0]
		: req.ip
}

export const getSessionMetadata = (req: Request, userAgent: string): SessionMetadata => {
	const ip = getIp(req)
	const device = new DeviceDetector().parse(userAgent)
	const location = lookup(ip)

	return {
		ip,
		device: {
			os: device.os.name,
			type: device.device.type,
			browser: device.client.name
		},
		location: {
			country: countries.getName(location.country, 'en') || location.country || 'Unknown',
			city: location.city || 'Unknown',
			latitude: location.ll[0] || 0,
			longitude: location.ll[1] || 0
		}
	}
}
