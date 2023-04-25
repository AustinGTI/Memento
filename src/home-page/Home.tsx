import React from "react";
import {PageHeader} from "../globals/GlobalComponents";
import {useSelector} from "react-redux";
import {Theme, ThemeState} from "../redux/theme_slice";


// the main home page component
export default function Home() : JSX.Element {
    // ? CONSTANTS AND STATES
    const theme : ThemeState = useSelector(({theme}: any) => theme.state);
    return (
        <div className={`home-page theme-${theme}`}>
            <PageHeader/>
            <h1>Home Page</h1>
        </div>
    );
}