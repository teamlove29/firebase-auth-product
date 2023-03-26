import { FC, ReactNode } from 'react'
import Head from 'next/head'
import { styled, Container, Spacer, Text } from '@nextui-org/react'

const Main = styled(Container, {
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
})

interface ILayout {
	title?: string
	children: ReactNode
}

const Layout: FC<ILayout> = ({ title, children }) => {
	const _title = title ? `${title} - Order plus test` : 'Order plus test'
	return (
		<>
			<Head>
				<title>{_title}</title>
			</Head>

			<Main
				fluid
				responsive
				md
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Text weight={'bold'} size={'$5xl'}>
					Welcome to Order Plus Test
				</Text>
				<Text>
					Order Plus Test is an app for managing orders and products.
				</Text>
				<Spacer y={1} />
				{children}
			</Main>
		</>
	)
}

export default Layout
