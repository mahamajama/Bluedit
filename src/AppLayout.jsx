import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router";

import Search from './Components/Search/Search';

export default function AppLayout() {
    const [headerCollapsed, setHeaderCollapsed] = useState(false);
    const minHeaderScrollHeight = 20;
    let lastScrollPosition = 0;
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        const position = window.pageYOffset;
        if (position < lastScrollPosition || position < minHeaderScrollHeight) {
            setHeaderCollapsed(false);
        } else if (position > lastScrollPosition || position > minHeaderScrollHeight) {
            setHeaderCollapsed(true);
        }
        lastScrollPosition = position;
    }
    return (
        <main>
            <header id="header">
                <div className={`logoContainer ${headerCollapsed ? 'collapsed' : ''}`}>
                    <Link to="/" id="logo" className={headerCollapsed ? 'collapsed' : ''}>BLUEDIT</Link>
                </div>
                <Search collapsed={headerCollapsed} />
            </header>
            <div className="contentContainer">
                <Outlet />
            </div>
        </main>
    );
}