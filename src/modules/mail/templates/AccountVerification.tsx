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
import { SUPPORT_EMAIL } from '@/src/shared/constants'

interface AccountVerificationProps {
	domain: string
	token: string
}

export const AccountVerification = ({ domain, token }: AccountVerificationProps) => (
	<Html>
		{/* eslint-disable-next-line prettier/prettier */}
		<Head />
		{/* TODO поменять стили через style */}
		<Preview>Tweetch Account Verification</Preview>
		<Tailwind>
			<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
				<Section className='text-center mb-8'>
					<Heading className='text-3xl text-black font-bold'>Confirmation of your email</Heading>
					<Text className='text-base text-black'>
						Thank you for registering on tweetch! To confirm the email address, please follow the link:
					</Text>
					<Link
						href={`${domain}/account-verify/${token}`}
						className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'
					>
						Confirm email
					</Link>
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
