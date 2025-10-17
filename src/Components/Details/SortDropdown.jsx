import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router";

import Dropdown from "../Features/Dropdown";

import { isEmpty } from "../../utils/helpers";

export default function SortDropdown({ param, options }) {
    const [params, setParams] = useSearchParams();
    const [selection, setSelection] = useState(null);
    let location = useLocation();

    useEffect(() => {
        if (options && !isEmpty(options)) {
            const value = params.get(param);
            let key = Object.keys(options).find(key => options[key] === value);
            if (!key || !value) key = null;
            setSelection(key);
        }
    }, [location])

    function handleOptionSelected(value) {
        setParams(params => {
            params.set(param, value);
            return params;
        });
    }

    return (
        <Dropdown options={options} onOptionSelected={handleOptionSelected} currentSelection={selection} />
    );
}