import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { selectTab, setTab } from "../Lists/listsSlice";
import Dropdown from "../Features/Dropdown";

export default function NavDropdown({ tabs }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selection, setSelection] = useState('default');
    
    const [params] = useSearchParams();

    const tab = useSelector(selectTab);

    const handleOptionSelected = (e) => {
        const value = e.target.getAttribute('data-value');
        const key = e.target.textContent;
        
        dispatch( setTab(key) );

        const currentParams = params.size > 0 ? `?${params.toString()}` : '';
        navigate(`${value}${currentParams}`);
    }

    useEffect(() => {
        if (tab) {
            setSelection(tab);
        } else {
            setSelection('default');
        }
    }, [tab]);

    return (
        <Dropdown 
            options={tabs} 
            onOptionSelected={handleOptionSelected}
            currentSelection={selection}
        />
    );
}