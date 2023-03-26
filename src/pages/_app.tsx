import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import useAuth from '../../hooks/useAuth'
import { Provider } from 'react-redux'
import { persistor, store } from '../../store'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
	useAuth()

	return (
		<>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<NextUIProvider>
						<ToastContainer />
						<Component {...pageProps} />
					</NextUIProvider>
				</PersistGate>
			</Provider>
		</>
	)
}
