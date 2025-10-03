import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';

import SortDropdown from "./SortDropdown";
import TimeDropdown from "./TimeDropdown";
import NavDropdown from "./NavDropdown";
import SafeSearchToggle from "./SafeSearchToggle";

const headerContent = document.getElementById("headerContent");

export default function Details({ title, tabs, sort, time, safeSearch }) {
    const [domReady, setDomReady] = useState(false);
    useEffect(() => {
        setDomReady(true);
    }, []);

    return (
        <>
            {domReady && createPortal(
                <>
                    <div className="detailsContainer">
                        {title && <p className="detailsTitle">{`${title}`}</p>}
                        {tabs && <NavDropdown tabs={tabs} />}
                        {sort && <SortDropdown param="sort" options={sort}/>}
                        {time && <TimeDropdown />}
                        {safeSearch && <SafeSearchToggle />}
                    </div>
                </>
                , header
            )}
        </>
    );
}