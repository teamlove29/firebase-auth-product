import { combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import productReducer from './product/product.reducer'

export const persistedReducer = persistReducer(
	{
		key: 'worldician',
		version: 1,
		storage,
	},
	combineReducers({
		product: productReducer,
	}),
)
