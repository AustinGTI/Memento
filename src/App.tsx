import React, {useState} from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css'
import Home from "./home-page/Home";
import About from "./about-page/About";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {themeReducer} from "./redux/theme_slice";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";


// region REDUX CONFIGURATION
const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    theme: themeReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

const persistor = persistStore(store);

// endregion


function App() {
    const [count, setCount] = useState(0)

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App
