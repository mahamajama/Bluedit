import { useSearchParams } from "react-router";

import Dropdown from "../Features/Dropdown";

export default function SortDropdown({ param, options }) {
    const [params, setParams] = useSearchParams();

    function handleOptionSelected(value) {
        setParams(params => {
            params.set(param, value);
            return params;
        });
    }

    return (
        <Dropdown options={options} onOptionSelected={handleOptionSelected} />
    );
}