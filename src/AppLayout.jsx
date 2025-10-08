import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";

import Search from './Components/Search/Search';
import Background from "./Components/Background/Background";

let searchFocusedBool = false;
let lastScrollPosition = 0;

export default function AppLayout() {
    const [headerCollapsed, setHeaderCollapsed] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    let location = useLocation();
    
    const contentContainer = useRef(null);
    const header = useRef(null);

    const minHeaderScrollHeight = 20;

    useEffect(() => {
        if (contentContainer.current && header.current) {
            header.current.addEventListener('wheel', handleScrollWithinHeader, { passive: true });
            contentContainer.current.addEventListener('scroll', handleScroll, { passive: true });
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [contentContainer, header]);

    useEffect(() => {
        if (searchFocused) {
            searchFocusedBool = true;
            setHeaderCollapsed(false);
        } else {
            searchFocusedBool = false;
        }
    }, [searchFocused]);

    useEffect(() => {
        if (contentContainer.current && (!location.pathname || location.pathname === '/')) {
            contentContainer.current.scrollTo(0, 0);
        }
    }, [location])

    const handleScrollWithinHeader = (e) => {
        if (contentContainer.current) {
            contentContainer.current.scrollBy(0, e.deltaY);
        }
    }

    const handleScroll = () => {
        if (contentContainer.current) {
            const position = contentContainer.current.scrollTop;
            if (!searchFocusedBool) {
                if (position < lastScrollPosition || position < minHeaderScrollHeight) {
                    setHeaderCollapsed(false);
                } else if (position > lastScrollPosition || position > minHeaderScrollHeight) {
                    setHeaderCollapsed(true);
                }
            }
            lastScrollPosition = position;
        }
    }

    function handleSearchFocused() {
        setSearchFocused(true);
        searchFocusedBool = true;
    }
    function handleSearchBlurred() {
        setSearchFocused(false);
        searchFocusedBool = false;
    }

    return (
        <main>
            <header id="header" ref={header}>
                <div id="headerContent">
                    <div className={`logoContainer ${headerCollapsed ? 'collapsed' : ''}`}>
                        <Link to='/' id="logo" className={headerCollapsed ? 'collapsed' : ''}>BLUEDIT</Link>
                    </div>
                    <Search collapsed={headerCollapsed} onFocus={handleSearchFocused} onBlur={handleSearchBlurred} />
                </div>
            </header>
            <div id="contentContainer" className={`${headerCollapsed ? 'headerCollapsed' : ''}`} ref={contentContainer}>
                <Outlet />
            </div>
            <Background />
        </main>
    );
}