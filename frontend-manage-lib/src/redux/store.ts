import { createStore, applyMiddleware } from "redux"
import RootReducer from './reducer/RootReducer'
import {composeWithDevTools} from "redux-devtools-extension"
import thunk from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {  ThunkAction, Action } from '@reduxjs/toolkit'

const middleware=[thunk]

export const store = createStore(
    RootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
)

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;
