import * as React from 'react'
import { Html } from '@react-email/html'
import {
	Body,
	Head,
	Heading,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'

interface VerificationTemplateProps {
	domain: string
	token: string
}


export const AccountVerificationTemplate = ({ domain, token }: VerificationTemplateProps) => {
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html>
			{/* eslint-disable-next-line prettier/prettier */}
			<Head />
			<Preview>Account verification</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>Confirmation of your email</Heading>
                        <Text className='text-base text-black'>
	                        Thank you for registering on twitch! To confirm the email address, please follow the link:
						</Text>
						<Link href={verificationLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
							Confirm email
						</Link>
					</Section>
					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have any questions or encounter difficulties, do not hesitate to contact our support team at{' '}
							<Link href="mailto:help@teastream.ru" className="text-[#18b9ae] underline">
								help@teastream.ru
							</Link>.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
