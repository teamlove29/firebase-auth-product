import { useState } from 'react'
import { auth, db } from '../config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import {
	Spacer,
	Input,
	Button,
	Text,
	Loading,
	Row,
	Card,
} from '@nextui-org/react'

import { useRouter } from 'next/router'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore'
import { createHash } from 'crypto'

interface SignInFormData {
	username: string
	password: string
}

const SignInForm = () => {
	const router = useRouter()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormData>()

	const onSubmit = async (data: SignInFormData) => {
		setLoading(true)
		try {
			const userQuery = query(
				collection(db, 'users'),
				where('username', '==', data.username),
			)
			const querySnapshot = await getDocs(userQuery)

			if (querySnapshot.empty) {
				setError('Invalid username or password')
				setLoading(false)
				return
			}

			const userDoc = querySnapshot.docs[0]
			const user = userDoc.data()
			const passwordHash = user.passwordHash

			const hash = createHash('sha256')
				.update(data.password + user.salt)
				.digest('hex')

			if (passwordHash === hash) {
				await signInWithEmailAndPassword(
					auth,
					user.email,
					data.password,
				)
				router.push('/')
			} else {
				setError('Invalid username or password')
			}
		} catch (error: any) {
			if (error.code === 'auth/user-not-found') {
				setError(
					'User not found. Please check your email address or sign up for a new account.',
				)
			} else if (error.code === 'auth/wrong-password') {
				setError('Incorrect password. Please try again.')
			} else {
				setError(error.message)
			}
		}
		setLoading(false)
	}

	return (
		<Card variant="bordered" css={{ mw: '350px' }}>
			<Card.Body>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Text h2>Sign In</Text>
					<Spacer y={1} />

					<Input
						css={{
							w: '20rem',
						}}
						placeholder="Username"
						{...register('username', {
							required: true,
							pattern: {
								value: /^[a-zA-Z0-9_-]+$/,
								message: 'Invalid username format',
							},
						})}
					/>
					{errors.username?.type === 'required' && (
						<div>
							<Text small color="error">
								Username is required
							</Text>
						</div>
					)}
					{errors.username?.type === 'pattern' && (
						<div>
							<Text small color="error">
								Invalid username format (only alphanumeric
								characters, underscores, and hyphens are
								allowed)
							</Text>
						</div>
					)}
					<Spacer y={0.5} />
					<Input.Password
						css={{
							w: '20rem',
						}}
						placeholder="Password"
						{...register('password', { required: true })}
					/>
					{errors.password && (
						<div>
							<Text small color="error">
								Password is required
							</Text>
						</div>
					)}
					<Spacer y={1} />
					{error && (
						<Text small color="error">
							{error}
						</Text>
					)}
					<Button
						color="success"
						type="submit"
						css={{
							w: '20rem',
						}}
					>
						{loading ? (
							<Loading color="currentColor" size="sm" />
						) : (
							'Sign In'
						)}
					</Button>
					<Row justify="center">
						<Text b size={16}>
							or
						</Text>
					</Row>

					<Button
						color="default"
						css={{
							w: '20rem',
						}}
						onPress={() => router.push('/signUp')}
					>
						Register
					</Button>
				</form>
			</Card.Body>
		</Card>
	)
}

export default SignInForm
