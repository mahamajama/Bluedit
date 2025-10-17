import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import Background from "./Components/Background/Background";
import Post from "./Components/Posts/Post";
import List from "./Components/Lists/List";
import { selectList, selectPost, selectIsLoading } from './Components/Lists/listsSlice';

import { getScrollbarWidth } from "./utils/helpers";

let searchFocusedBool = false;
let lastScrollPosition = 0;

const scrollbarWidth = getScrollbarWidth();

export default function AppLayout() {
    const [headerCollapsed, setHeaderCollapsed] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [backgroundInitiated, setBackgroundInitiated] = useState(false);
    const [postToRender, setPostToRender] = useState([]);
    const [listToRender, setListToRender] = useState([]);
    const [isReady, setIsReady] = useState(false);

    let location = useLocation();
    
    const contentContainer = useRef(null);
    const header = useRef(null);

    const isLoading = useSelector(selectIsLoading);
    const currentPost = useSelector(selectPost);
    const currentList = useSelector(selectList);

    const minHeaderScrollHeight = 20;

    useEffect(() => {
        setBackgroundInitiated(true);
    }, [])

    useEffect(() => {
        if (contentContainer.current && header.current && scrollbarWidth) {
            document.body.style.setProperty('--scroll-width', `${scrollbarWidth}px`);
        }
    }, [contentContainer, header, scrollbarWidth])

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
        if (contentContainer.current) {
            contentContainer.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [location])

    const handleScrollWithinHeader = (e) => {
        if (contentContainer.current) {
            contentContainer.current.scrollBy({top: e.deltaY, behavior: 'smooth'});
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

    useEffect(() => {
        if (contentContainer.current?.childElementCount > 0) {
            unloadItems();
        } else {
            loadItems();
        }
    }, [isLoading]);

    function unloadItems() {
        if (contentContainer.current) {
            const unloadTime = 1;
            setIsReady(false);
            const items = contentContainer.current.children;
            const delta =  unloadTime / items.length;
            for (let i = 0; i < items.length; i++) {
                if (i === 0) {
                    if (postToRender === currentPost) continue;
                }
                let delay = delta * i;
                items[i].style.animation = `unloadItem 1s ${delay}s forwards ease-out`;
                if (i === items.length - 1) {
                    items[i].addEventListener('animationend', onUnloadComplete);
                }
            }
        }
    }

    function onUnloadComplete() {
        const items = contentContainer.current.children;
        for (let i = 0; i < items.length; i++) {
            items[i].style.animation = null;
        }
        setIsReady(true);
    }

    function loadItems() {
        const post = { ...currentPost };
        setPostToRender(post);

        const list = [ ...currentList ];
        setListToRender(list);

        setIsReady(false);
    }

    useEffect(() => {
        if (isReady && !isLoading) loadItems();
    }, [isReady, isLoading]);

    return (
        <main>
            <header id="header" ref={header}>
                <Header collapsed={headerCollapsed} onSearchFocused={handleSearchFocused} onSearchBlurred={handleSearchBlurred} />
            </header>
            <div id="contentContainer" className={`${headerCollapsed ? 'headerCollapsed' : ''}`} ref={contentContainer}>
                <Outlet />
                <Post post={postToRender} />
                <List list={listToRender} />
            </div>
            <Background initiated={backgroundInitiated} />
        </main>
    );
}