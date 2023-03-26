import { useState, useEffect, FC, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { Spacer, Input, Button, Text, Modal } from '@nextui-org/react'
import { useAppDispatch } from '../../store/hooks'
import {
	Product,
	createProduct,
	fetchProducts,
	editProduct,
} from '../../store/reducers/product/product.reducer'

interface ProductFormData {
	id: string
	code: string
	name: string
	price: string
}

interface ModalProps {
	product?: Product
	visible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
}

const CreateProductModal: FC<ModalProps> = ({
	product,
	visible,
	setVisible,
}) => {
	const dispatch = useAppDispatch()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ProductFormData>()

	const closeHandler = () => {
		setVisible(false)
	}

	const onSubmit = async (data: ProductFormData) => {
		try {
			const productData: Product = {
				id: data.id ?? product?.id,
				code: data.code.toLowerCase(),
				name: data.name.toLowerCase(),
				price: parseFloat(data.price),
			}
			if (product) {
				await dispatch(editProduct(productData))
			} else {
				await dispatch(createProduct(productData))
			}
		} catch (error: any) {
			console.error(error)
		}

		setVisible(false)
		reset()
		await dispatch(fetchProducts())
	}

	useEffect(() => {
		if (product) {
			reset({
				code: product.code,
				name: product.name,
				price: product.price.toString(),
			})
		}
	}, [product])

	return (
		<div>
			<Modal
				closeButton
				aria-labelledby="modal-title"
				open={visible}
				onClose={closeHandler}
			>
				<Modal.Header>
					<Text h2>
						{product ? 'Edit Product' : 'Create Product'}
					</Text>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Input
							clearable
							bordered
							fullWidth
							type="text"
							label="Code"
							placeholder="Product Code"
							{...register('code', { required: true })}
						/>
						{errors.code && (
							<Text small color="error">
								Product code is required
							</Text>
						)}
						<Spacer y={0.5} />
						<Input
							clearable
							bordered
							fullWidth
							type="text"
							label="Product Name"
							placeholder="Product Name"
							{...register('name', { required: true })}
						/>
						{errors.name && (
							<Text small color="error">
								Product name is required
							</Text>
						)}
						<Spacer y={0.5} />
						<Input
							clearable
							bordered
							fullWidth
							type="number"
							step="0.01"
							min="0"
							label="Product Price"
							placeholder="Product Price"
							{...register('price', {
								required: true,
								pattern: {
									value: /^[0-9]+(.[0-9]{1,2})?$/,
									message: 'Invalid price format',
								},
							})}
						/>
						{errors.price && (
							<Text small color="error">
								{errors.price.message ||
									'Product price is required'}
							</Text>
						)}
						<Modal.Footer>
							<Button
								auto
								flat
								color="error"
								onPress={closeHandler}
							>
								Close
							</Button>
							<Button color={'success'} auto type="submit">
								{product ? 'Save Changes' : 'Create Product'}
							</Button>
						</Modal.Footer>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default CreateProductModal
