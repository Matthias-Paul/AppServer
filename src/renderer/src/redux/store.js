import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from "./slice/adminSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
    admin: userReducer,

})   

const persistConfig = {
    key:"root",
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })

})

export const persistor = persistStore(store)

