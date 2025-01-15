import * as React from 'react'
import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import { SessionMetadata } from '@/src/shared/types'
import { SUPPORT_EMAIL } from '@/src/shared/constants'

interface AccountDeactivationProps {
	token: string
	metadata: SessionMetadata
}

export const AccountDeactivation = ({ token, metadata }: AccountDeactivationProps) => {
	const { ip, device, location } = metadata

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Head />
			<Preview>Account Deactivation</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>Account deactivation request</Heading>
						<Text className='text-black text-base mt-2'>
							You have initiated the process of deactivating your account on the <b>Tweetch</b> platform.
						</Text>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
						<Heading className='text-2xl text-black font-semibold'>Deactivation code:</Heading>
						<Heading className='text-3xl text-black font-semibold'>{token}</Heading>
						<Text className='text-black'>This code is valid for 5 minutes.</Text>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-[#18B9AE]'>Request information:</Heading>
						<ul className='list-disc list-inside text-black mt-2'>
							<li>🌍 Location: {location.country}, {location.city}</li>
							<li>📱 OS: {device.os}</li>
							<li>🌐 Browser: {device.browser}</li>
							<li>💻 IP address: {ip}</li>
						</ul>
						<Text className='text-gray-600 mt-2'>If you did not initiate this request, please ignore this message.</Text>
					</Section>
					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have any questions or encounter difficulties, do not hesitate to contact our support team at{' '}
							<Link href={`mailto:${SUPPORT_EMAIL}`} className='text-[#18b9ae] underline'>
								{SUPPORT_EMAIL}
							</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
