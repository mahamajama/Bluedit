import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { v4 as uuidv4 } from 'uuid';

export default function SortDropdown({ name, param, options }) {
    const [params, setParams] = useSearchParams();
    const [value, setValue] = useState('');
    useEffect(() => {
        const current = params.get(param);
        if (current) {
            setValue(current);
        } else {
            setValue('');
        }
    }, [params])

    const [optionsToDisplay, setOptionsToDisplay] = useState([]);
    useEffect(() => {
        setOptionsToDisplay(getOptionsToDisplay());
    }, [options])

    function getOptionsToDisplay() {
        let arr = [];
        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
            arr.push(<option value={keys[i]} key={uuidv4()}>{options[keys[i]]}</option>);
        }
        return arr;
    }

    const handleChange = (e) => {
        setParams(params => {
            params.set(param, e.target.value);
            return params;
        });
    }
    return (
        <label className="detailsTab">
            {name ? name : 'Sort'}:&nbsp;
            <select
                name={param}
                value={value}
                onChange={handleChange}
            >
                {optionsToDisplay}
            </select>
        </label>
    );
}