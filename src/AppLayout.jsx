import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router";

import Search from './Components/Search/Search';

export default function AppLayout() {
    return (
        <main>
            <header className="header">
                <Link to="/" id="logo">BLUEDIT</Link>
                <Search />
            </header>
            <div className="contentContainer">
                <Outlet />
            </div>
        </main>
    );
}