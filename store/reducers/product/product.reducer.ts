import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	orderBy,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { db } from '../../../config'
import { RootState } from '../..'
import { toast } from 'react-toastify'

export interface Product {
	id: string
	code: string
	name: string
	price: number
}

export interface ProductNoId {
	code: string
	name: string
	price: number
}

export interface ProductState {
	data: Product[]
	isLoading: boolean
	isError: boolean
}

const initialState: ProductState = {
	data: [],
	isLoading: false,
	isError: false,
}

export const fetchProducts = createAsyncThunk(
	'product/fetchProducts',
	async () => {
		const productsRef = collection(db, 'products')
		const snapshot = await getDocs(query(productsRef, orderBy('code')))
		return snapshot.docs.map((doc) => {
			const data = doc.data() as Product
			return {
				...data,
				id: doc.id,
			}
		})
	},
)

export const fetchProductBySearch = createAsyncThunk(
	'product/fetchProductBySearch',
	async (searchTerm: string) => {
		try {
			const productsByName = await fetchProductsByField(
				'name',
				searchTerm,
			)
			const productsByCode = await fetchProductsByField(
				'code',
				searchTerm,
			)
			const uniqueProducts = mergeUniqueProducts(
				productsByName,
				productsByCode,
			)
			return uniqueProducts
		} catch (err) {
			console.error('Error fetching products by search term:', err)
			return []
		}
	},
)

export const createProduct = createAsyncThunk(
	'product/createProduct',
	async (product: Product) => {
		try {
			const queryCode = query(
				collection(db, 'products'),
				where('code', '==', product.code.toLowerCase()),
			)

			const queryName = query(
				collection(db, 'products'),
				where('name', '==', product.name.toLowerCase()),
			)

			const [queryNameSnapshot, queryCodeSnapshot] = await Promise.all([
				getDocs(queryName),
				getDocs(queryCode),
			])

			if (!queryNameSnapshot.empty || !queryCodeSnapshot.empty) {
				toast.error(`Product code already exists`, {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'colored',
				})
			} else {
				await addDoc(collection(db, 'products'), {
					code: product.code.toLowerCase(),
					name: product.name.toLowerCase(),
					price: parseFloat(product.price.toString()),
				})
				toast.success(`You just created product Congratulations`, {
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'colored',
				})
			}
		} catch (err) {
			return []
		}
	},
)

export const editProduct = createAsyncThunk(
	'product/editProduct',
	async (product: Product) => {
		try {
			const queryName = query(
				collection(db, 'products'),
				where('name', '==', product.name.toLowerCase()),
			)

			const queryCode = query(
				collection(db, 'products'),
				where('code', '==', product.code.toLowerCase()),
			)

			const [queryNameSnapshot, queryCodeSnapshot] = await Promise.all([
				getDocs(queryName),
				getDocs(queryCode),
			])

			if (product) {
				const productRef = doc(db, 'products', product.id)
				const productDoc = await getDoc(productRef)
				const productData = productDoc.data() as ProductNoId

				if (
					productData.name === product.name &&
					productData.code === product.code
				) {
					await updateDoc(productRef, {
						code: product.code.toLowerCase(),
						name: product.name.toLowerCase(),
						price: parseFloat(product.price.toString()),
					})

					toast.success(`You just edited product Congratulations`, {
						position: 'top-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'colored',
					})
				} else if (productData.name === product.name) {
					if (queryCodeSnapshot.empty) {
						await updateDoc(productRef, {
							code: product.code.toLowerCase(),
							name: product.name.toLowerCase(),
							price: parseFloat(product.price.toString()),
						})

						toast.success(
							`You just edited product Congratulations`,
							{
								position: 'top-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: 'colored',
							},
						)
					} else {
						toast.error(
							`Product code "${product.code}" is already taken.`,
							{
								position: 'top-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: 'colored',
							},
						)
					}
				} else if (productData.code === product.code) {
					if (queryNameSnapshot.empty) {
						await updateDoc(productRef, {
							code: product.code.toLowerCase(),
							name: product.name.toLowerCase(),
							price: parseFloat(product.price.toString()),
						})

						toast.success(
							`You just edited product Congratulations`,
							{
								position: 'top-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: 'colored',
							},
						)
					} else {
						toast.error(
							`Product name "${product.name}" is already taken.`,
							{
								position: 'top-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: 'colored',
							},
						)
					}
				} else {
					if (queryCodeSnapshot.empty && queryNameSnapshot.empty) {
						await updateDoc(productRef, {
							code: product.code.toLowerCase(),
							name: product.name.toLowerCase(),
							price: parseFloat(product.price.toString()),
						})

						toast.success(
							`You just edited product Congratulations`,
							{
								position: 'top-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								theme: 'colored',
							},
						)
					}
				}
			}
		} catch (err) {
			toast.error(`Error editing product`, {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'colored',
			})
			return
		}
	},
)

// Fuction other plus

const fetchProductsByField = async (field: string, searchTerm: string) => {
	const productsRef = collection(db, 'products')
	const querySnapshot = query(
		productsRef,
		where(field, '>=', searchTerm),
		where(field, '<=', searchTerm + '\uf8ff'),
	)
	const docSnapshots = await getDocs(querySnapshot)
	const products: Product[] = []
	docSnapshots.forEach((doc) => {
		const data = doc.data()
		products.push({
			id: doc.id,
			code: data.code,
			name: data.name,
			price: data.price,
		} as Product)
	})
	return products
}

const mergeUniqueProducts = (productsA: Product[], productsB: Product[]) => {
	const uniqueProducts: Product[] = [...productsA]
	productsB.forEach((productB) => {
		if (
			!uniqueProducts.some((productA) => productA.code === productB.code)
		) {
			uniqueProducts.push(productB)
		}
	})
	return uniqueProducts
}

export const productSlice = createSlice({
	name: 'product',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.isLoading = true
				state.isError = false
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.isLoading = false
				state.isError = false
				state.data = action.payload
			})
			.addCase(fetchProducts.rejected, (state) => {
				state.isLoading = false
				state.isError = true
			})
			.addCase(fetchProductBySearch.pending, (state) => {
				state.isLoading = true
				state.isError = false
			})
			.addCase(fetchProductBySearch.fulfilled, (state, action) => {
				state.isLoading = false
				state.isError = false
				state.data = action.payload
			})
			.addCase(fetchProductBySearch.rejected, (state) => {
				state.isLoading = false
				state.isError = true
			})
		// .addCase(createProduct.pending, (state) => {
		// 	state.isLoading = true
		// 	state.isError = false
		// })
		// .addCase(createProduct.fulfilled, (state) => {
		// 	state.isLoading = false
		// 	state.isError = false
		// })
		// .addCase(createProduct.rejected, (state) => {
		// 	state.isLoading = false
		// 	state.isError = true
		// })
		// .addCase(editProduct.pending, (state) => {
		// 	state.isLoading = true
		// 	state.isError = false
		// })
		// .addCase(editProduct.fulfilled, (state) => {
		// 	state.isLoading = false
		// 	state.isError = false
		// })
		// .addCase(editProduct.rejected, (state) => {
		// 	state.isLoading = false
		// 	state.isError = true
		// })
	},
})

export const selectProductData = (state: RootState) => state.product.data

export const selectProductLoading = (state: RootState) =>
	state.product.isLoading

export const selectProductError = (state: RootState) => state.product.isError

export default productSlice.reducer
