import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";

import Search from './Components/Search/Search';

export default function AppLayout() {
    return (
        <div>
            <header>
                <h1>BLUEDIT</h1>
            </header>
            <main>
                <div className="searchContainer">
                    <Search />
                </div>
                <Outlet />
            </main>
        </div>
    );
}