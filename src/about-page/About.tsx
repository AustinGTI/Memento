import React from "react";
import {ThemeState} from "../redux/theme_slice";
import {useSelector} from "react-redux";


// the main about page component
export default function About() : JSX.Element {
    // ? CONSTANTS AND STATES
    const theme : ThemeState = useSelector(({theme}: any) => theme.state);
    return (
        <div className={`about-page theme-${theme}`}>
            <h1>About Page</h1>
        </div>
    );
}
