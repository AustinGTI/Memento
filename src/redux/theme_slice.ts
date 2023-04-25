import {createSlice} from "@reduxjs/toolkit";


export enum ThemeState {
    LIGHT = 'light',
    DARK = 'dark',
}

export type Theme = {
    state: ThemeState,
}


const theme_slice = createSlice({
    name: 'theme',
    initialState: {
        state: 'light',
    } as Theme,
    reducers: {
        setTheme: (state, action: { payload: ThemeState }) => {
            state.state = action.payload;
        }
    }
})

export const {setTheme} = theme_slice.actions;
export const themeReducer = theme_slice.reducer;
