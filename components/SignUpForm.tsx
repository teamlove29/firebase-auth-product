import { useState } from 'react'
import { auth, db } from '../config'
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth'
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
	getFirestore,
	setDoc,
} from 'firebase/firestore'
import { createHash, randomBytes } from 'crypto'

interface SignUpFormData {
	username: string
	password: string
	confirmPassword: string
}

const SignUpForm = () => {
	const router = useRouter()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>()

	const onSubmit = async ({
		username,
		password,
		confirmPassword,
	}: SignUpFormData) => {
		setLoading(true)

		if (password !== confirmPassword) {
			setError('Passwords do not match')
			setLoading(false)
			return
		}

		// Check the length of the username and password
		if (username.length < 6 || username.length > 20) {
			setError('Username must be between 6 and 20 characters')
			setLoading(false)
			return
		}

		if (password.length < 6 || password.length > 20) {
			setError('Password must be between 6 and 20 characters')
			setLoading(false)
			return
		}

		const userRef = doc(collection(db, 'users'))
		await createUserWithEmailAndPassword(
			auth,
			`${username}@example.com`,
			password,
		)
		// Generate a salt
		const salt = randomBytes(16).toString('hex')

		// Hash the password with the salt using SHA-256
		const hash = createHash('sha256')
			.update(password + salt)
			.digest('hex')

		await setDoc(userRef, {
			username,
			email: `${username}@example.com`,
			passwordHash: hash,
			salt,
		})

		try {
			// Sign in the user using their email and password
			await signInWithEmailAndPassword(
				auth,
				`${username}@example.com`,
				password,
			)
			router.push('/')
		} catch (error: any) {
			console.log('error', error)
			if (error.code === 'auth/email-already-in-use') {
				setError(
					'The provided email address is already in use by another account.',
				)
			} else {
				setError(
					'An unexpected error occurred. Please try again later.',
				)
			}
		}

		setLoading(false)
	}

	return (
		<Card variant="bordered" css={{ mw: '350px' }}>
			<Card.Body>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Text h2>Sign Up</Text>
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
							minLength: {
								value: 6,
								message:
									'Username must be at least 6 characters',
							},
							maxLength: {
								value: 20,
								message:
									'Username must be at most 20 characters',
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
					{errors.username?.type === 'minLength' && (
						<div>
							<Text small color="error">
								Username must be at least 6 characters
							</Text>
						</div>
					)}
					{errors.username?.type === 'maxLength' && (
						<div>
							<Text small color="error">
								Username must be at most 20 characters
							</Text>
						</div>
					)}

					<Spacer y={0.5} />
					<Input.Password
						css={{
							w: '20rem',
						}}
						placeholder="Password"
						{...register('password', {
							required: true,
							minLength: 8,
						})}
					/>
					{errors.password && (
						<div>
							<Text small color="error">
								{errors.password.type === 'required'
									? 'Password is required'
									: 'Password must be at least 8 characters long'}
							</Text>
						</div>
					)}
					<Spacer y={0.5} />
					<Input.Password
						css={{
							w: '20rem',
						}}
						placeholder="Confirm Password"
						{...register('confirmPassword', { required: true })}
					/>
					{errors.confirmPassword && (
						<div>
							<Text small color="error">
								Confirm password is required
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
							'Register'
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
						onPress={() => router.push('/signIn')}
					>
						Sign In
					</Button>
				</form>
			</Card.Body>
		</Card>
	)
}

export default SignUpForm
