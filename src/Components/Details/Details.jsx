import { useEffect } from "react";
import { useSelector } from "react-redux";

import { selectTitle, selectOptions } from './detailsSlice';

import SortDropdown from "./SortDropdown";
import TimeDropdown from "./TimeDropdown";
import NavDropdown from "./NavDropdown";
import SafeSearchToggle from "./SafeSearchToggle";
import Dropdown from "../Features/Dropdown";

export default function Details() {
    const title = useSelector(selectTitle);
    const options = useSelector(selectOptions);

    useEffect(() => {
    }, [options])

    const handleOptionSelected = (value) => {
        console.log(value);
    }

    return (
        <>
            <div className="detailsContainer">
                {title && <p className="detailsTitle">{`${title}`}</p>}
                <div>
                    {options.tabs && <NavDropdown tabs={options.tabs} />}
                    {options.sort && <SortDropdown param="sort" options={options.sort}/>}
                    {options.showTime && <TimeDropdown />}
                    {options.showSafeSearch && <SafeSearchToggle />}
                </div>
            </div>
        </>
    );
}