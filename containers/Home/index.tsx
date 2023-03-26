import { FC, useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { signOut, User } from 'firebase/auth'
import { auth } from '../../config'
import {
	Button,
	Grid,
	Input,
	Loading,
	Row,
	Spacer,
	Text,
} from '@nextui-org/react'
import { useRouter } from 'next/router'
import CreateProductModal from '../../components/Modal/CreateProduct'
import ProductList from '../../components/ProductLists'
import {
	fetchProductBySearch,
	fetchProducts,
} from '../../store/reducers/product/product.reducer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const HomeContainer: FC = () => {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const {
		data: products,
		isLoading,
		isError,
	} = useAppSelector((state) => state.product)

	const [loading, setLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [visible, setVisible] = useState(false)
	const [user, setUser] = useState<any>(null)

	const handleSignOut = async () => {
		setLoading(true)
		try {
			await signOut(auth)
			router.push('/signIn')
		} catch (error: any) {
			console.log(error.message)
		}
		setLoading(false)
	}

	const handleSearch = (value: string) => {
		setSearchTerm(value)

		if (value) {
			dispatch(fetchProductBySearch(value))
		} else {
			dispatch(fetchProducts())
		}
	}

	useEffect(() => {
		dispatch(fetchProducts())
		if (auth.currentUser) {
			setUser(auth.currentUser)
		}
	}, [auth.currentUser])

	if (!user) {
		return null
	}

	return (
		<Layout>
			<Spacer y={1} />
			<Button color={'error'} onClick={() => handleSignOut()}>
				{loading ? (
					<Loading color="currentColor" size="sm" />
				) : (
					'Sign Out'
				)}
			</Button>
			<Spacer y={1} />
			<Button onClick={() => setVisible(true)}>Create Product</Button>
			<CreateProductModal visible={visible} setVisible={setVisible} />
			<Spacer y={1} />

			<Input
				fullWidth
				placeholder="Search products"
				value={searchTerm}
				onChange={(e) => handleSearch(e.target.value)}
				clearable
			/>

			{isLoading && <Text>Loading...</Text>}
			{isError && <Text>Error loading products.</Text>}

			<Grid.Container gap={2}>
				{products.length > 0 ? (
					products.map((product, index) => (
						<ProductList product={product} index={index} />
					))
				) : (
					<Row justify="center">
						{!isLoading && <Text>No data</Text>}
					</Row>
				)}
			</Grid.Container>
		</Layout>
	)
}

export default HomeContainer
