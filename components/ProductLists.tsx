import { Grid, Card, Row, Text, Col } from '@nextui-org/react'
import { FC, useState } from 'react'
import {
	Product,
	selectProductLoading,
} from '../store/reducers/product/product.reducer'
import { useAppSelector } from '../store/hooks'
import { useRouter } from 'next/router'
import CreateProductModal from './Modal/CreateProduct'

interface ProductProps {
	product: Product
	index: number
}

const ProductList: FC<ProductProps> = ({ product, index }) => {
	const [visible, setVisible] = useState(false)

	return (
		<Grid xs={6} sm={3} key={index}>
			<CreateProductModal
				product={product}
				visible={visible}
				setVisible={setVisible}
			/>
			<Card
				isPressable
				isHoverable
				onClick={() => {
					setVisible(true)
				}}
			>
				<Card.Footer css={{ justifyItems: 'flex-start' }}>
					<Row wrap="wrap" justify="space-between" align="center">
						<Row>
							<Text h4 weight="bold">
								{product.name}
							</Text>
						</Row>

						<Text
							css={{
								color: '$accents8',
								fontWeight: '$medium',
								fontSize: '$md',
							}}
						>
							{product.code}
						</Text>
						<Text
							css={{
								color: '$accents8',
								fontWeight: '$medium',
								fontSize: '$md',
							}}
						>
							${product.price}
						</Text>
					</Row>
				</Card.Footer>
			</Card>
		</Grid>
	)
}

export default ProductList
