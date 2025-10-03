import { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router";

import Search from './Components/Search/Search';
import Background from "./Components/Background/Background";

let searchFocusedBool = false;
let lastScrollPosition = 0;
let transitioning = false;
let scrolling = false;

export default function AppLayout() {
    const [headerCollapsed, setHeaderCollapsed] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    
    const contentContainer = useRef(null);
    const header = useRef(null);
    const spacer = useRef(null);

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
        if (header.current) {
            header.current.addEventListener('transitionend', onTransitionComplete);
        }
        return () => {
            if (header.current) {
                transitioning = false;
                header.current.removeEventListener('transitionend', onTransitionComplete);
            }
        }
    }, [header]);

    useEffect(() => {
        if (searchFocused) {
            searchFocusedBool = true;
            setHeaderCollapsed(false);
        } else {
            searchFocusedBool = false;
        }
    }, [searchFocused]);

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
                    transitioning = true;
                    //updateClipPathContinuous();
                } else if (position > lastScrollPosition || position > minHeaderScrollHeight) {
                    setHeaderCollapsed(true);
                    transitioning = true;
                    //updateClipPathContinuous();
                }
            }
            lastScrollPosition = position;

            if (!transitioning) {
                let yPos = position + header.current.offsetHeight - 180;
                //contentContainer.current.style.clipPath = `inset(${yPos.toString()}px 0 0)`;
            }
        }
    }

    const updateClipPath = () => {
        let yPos = window.pageYOffset + header.current.offsetHeight - 180;
        contentContainer.current.style.clipPath = `inset(${yPos.toString()}px 0 0)`;
    }

    const updateClipPathContinuous = () => {
        updateClipPath();
        if (transitioning) {
            requestAnimationFrame(updateClipPathContinuous);
        }
    }

    function onTransitionComplete() {
        header.current.removeEventListener('transitionend', onTransitionComplete);
        transitioning = false;
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
                        <Link to="/" id="logo" className={headerCollapsed ? 'collapsed' : ''}>BLUEDIT</Link>
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