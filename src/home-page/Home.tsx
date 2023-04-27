import React from "react";
import {PageHeader} from "../globals/GlobalComponents";
import {useSelector} from "react-redux";
import {Theme, ThemeState} from "../redux/theme_slice";
import './home_styling.scss'
import Drawer from "./Drawer";
import Workspace from "./Workspace";


// the main home page component
export default function Home(): JSX.Element {
    // ? CONSTANTS AND STATES
    const theme: ThemeState = useSelector(({theme}: any) => theme.state);
    return (
        <>
            <PageHeader current_page={'home'}/>
            <div className={`page home-page theme-${theme}`}>
                <Drawer/>
                <Workspace/>
            </div>
        </>
    );
}