import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import { useSelector } from "react-redux";

import { selectTitle, selectOptions } from './detailsSlice';
import { selectType, selectIsLoading } from "../Lists/listsSlice";

import SortDropdown from "./SortDropdown";
import TimeDropdown from "./TimeDropdown";
import NavDropdown from "./NavDropdown";
import SafeSearchToggle from "./SafeSearchToggle";

export default function Details() {
    const [showTabs, setShowTabs] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showSafeSearch, setShowSafeSearch] = useState(false);
    const [titleToRender, setTitleToRender] = useState('');
    const [titleDestination, setTitleDestination] = useState('r/popular');

    const titleRef = useRef(null);

    const title = useSelector(selectTitle);
    const options = useSelector(selectOptions);
    const type = useSelector(selectType);
    const isLoading = useSelector(selectIsLoading);

    let location = useLocation();

    useEffect(() => {
        if (title != titleToRender) {
            titleRef.current?.removeEventListener('animationend',  updateTitle);
            titleRef.current?.classList.add('unload');
            titleRef.current?.addEventListener('animationend', updateTitle);
        }
    },[title])

    function updateTitle() {
        titleRef.current?.removeEventListener('animationend',  updateTitle);
        setTitleToRender(title);
    }

    useEffect(() => {
        if (titleToRender === title) {
            titleRef.current?.classList.remove('unload');
        }
    }, [titleToRender]);

    useEffect(() => {
        setShowTabs(options.tabs);
        setShowSort(options.sort);
        setShowTime(options.showTime);
        setShowSafeSearch(options.showSafeSearch);
    },[options])

    useEffect(() => {
        if (!isLoading) {
            let path = `/${title}`;
            if (type === 'search' || type === 'subredditSearch') {
                const query = title.split(': ')[1].replace(' ', '+');
                path = `${location.pathname}?q=${query}`;
            }
            setTitleDestination(path);
        }
    }, [isLoading])

    return (
        <>
            <div className="detailsContainer">
                {title && 
                    <Link className="detailsTitle" to={titleDestination} ref={titleRef} >{`${titleToRender}`}</Link>
                }
                <div className="detailsTabContainer">
                    <div className={`detailsTab ${showTabs ? '' : 'hidden'}`}>
                        <NavDropdown tabs={options.tabs} />
                    </div>
                    <div className={`detailsTab ${showSort ? '' : 'hidden'}`}>
                        <SortDropdown param="sort" options={options.sort}/>
                    </div>
                    <div className={`detailsTab ${showTime ? '' : 'hidden'}`}>
                        <TimeDropdown />
                    </div>
                    <div className={`detailsTab ${showSafeSearch ? '' : 'hidden'}`}>
                        <SafeSearchToggle />
                    </div>
                </div>
            </div>
        </>
    );
}