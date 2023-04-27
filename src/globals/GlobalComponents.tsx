import React, {useCallback} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setTheme, ThemeState} from "../redux/theme_slice";

import './global_components_styling.scss'


// the page header component for all pages
export function PageHeader({current_page}: { current_page: string }): JSX.Element {
    // ? CONSTANTS AND STATES
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useSelector(({theme}: any) => theme.state);
    const dispatch = useDispatch();

    // ? FUNCTIONS
    // a handler for the home button that redirects to the home page if not already there
    const goToHome = useCallback((_: React.MouseEvent<HTMLButtonElement>): void => {
        if (location.pathname !== '/') {
            navigate('/');
        }
    }, [location, navigate]);

    // a handler for the about button that redirects to the about page if not already there
    const goToAbout = useCallback((_: React.MouseEvent<HTMLButtonElement>): void => {
        if (location.pathname !== '/about') {
            navigate('/about');
        }
    }, [location, navigate]);

    // a handler for the toggle theme button that toggles the theme
    const toggleTheme = useCallback((_: React.MouseEvent<HTMLButtonElement>): void => {
        if (theme === ThemeState.LIGHT) {
            dispatch(setTheme(ThemeState.DARK));
        } else {
            dispatch(setTheme(ThemeState.LIGHT));
        }
    }, [theme, dispatch]);

    return (
        <div className={'header-box'}>
            <div className={'left-btns-box'}>
                <button onClick={goToHome} className={'home-btn'}>Home</button>
            </div>
            <h1>Memento</h1>
            <div className={'right-btns-box'}>
                <button onClick={goToAbout} className={'about-btn'}>About</button>
                <button onClick={toggleTheme} className={'toggle-theme-btn'}>{
                    theme === 'light' ? 'Dark' : 'Light'
                }</button>
            </div>
        </div>
    );
}