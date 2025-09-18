import { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router";
import { v4 as uuidv4 } from 'uuid';

export default function NavDropdown({ title, tabs }) {
    const navigate = useNavigate();
    
    const [params] = useSearchParams();
    let location = useLocation();

    const [optionsToDisplay, setOptionsToDisplay] = useState([]);
    useEffect(() => {
        setOptionsToDisplay(getOptionsToDisplay());
    }, [tabs])

    function getOptionsToDisplay() {
        let arr = [];
        for (let i = 0; i < tabs.length; i++) {
            arr.push(<option value={tabs[i][0]} key={uuidv4()}>{tabs[i][1]}</option>);
        }
        return arr;
    }

    const handleChange = (e) => {
        const currentParams = params.size > 0 ? `?${params.toString()}` : '';
        navigate(`${e.target.value}${currentParams}`);
    }
    return (
        <label>
            {title ? title : 'Type'}:
            <select
                name="tab"
                value={location.pathname}
                onChange={handleChange}
            >
                {optionsToDisplay}
            </select>
        </label>
    );
}