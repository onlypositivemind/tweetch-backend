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

interface PasswordRecoveryProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export const PasswordRecovery = ({ domain, token, metadata }: PasswordRecoveryProps) => {
	const {ip, device, location} = metadata

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Head />
			<Preview>Password Recovery</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>Reset your password</Heading>
						<Text className='text-black text-base mt-2'>
							You have requested a password reset for your account.
						</Text>
						<Text className='text-black text-base mt-2'>
							To create a new password, click on the link below:
						</Text>
						<Link
							href={`${domain}/password-recovery/${token}`}
							className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
						>
							Reset password
						</Link>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-[#18B9AE]'>Request information:</Heading>
						<ul className='list-disc list-inside text-black mt-2'>
							<li>🌍 Location: {location.country}, {location.city}</li>
							<li>📱 OS: {device.os}</li>
							<li>🌐 Browser: {device.browser}</li>
							<li>💻 IP address: {ip}</li>
						</ul>
						<Text className='text-gray-600 mt-2'>
							If you did not initiate this request, please ignore this message.
						</Text>
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
