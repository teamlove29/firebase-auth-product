import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config'

const useAuth = () => {
	const router = useRouter()

	useEffect(() => {
		const handleAuthStateChange = (user: any) => {
			const isAuthPage =
				router.pathname === '/signIn' || router.pathname === '/signUp'

			if (user && isAuthPage) {
				router.push('/')
			} else if (!user && !isAuthPage) {
				router.push('/signIn')
			}
		}

		const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange)

		return () => {
			unsubscribe()
		}
	}, [router, auth])
}

export default useAuth
