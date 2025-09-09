import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";
//import ROUTES from "./routes";

import Search from './Components/Search/Search';
import Links from './Components/Links/Links';

export default function AppLayout() {
    return (
        <>
            <h1>BLUEDIT</h1>
            <Search />
            <Links />
        </>
    );
}