
import { useSearchParams, useNavigate } from "react-router";

import Dropdown from "../Features/Dropdown";

export default function NavDropdown({ tabs }) {
    const navigate = useNavigate();
    
    const [params] = useSearchParams();

    const handleOptionSelected = (value) => {
        const currentParams = params.size > 0 ? `?${params.toString()}` : '';
        navigate(`${value}${currentParams}`);
    }

    return (
        <Dropdown options={tabs} onOptionSelected={handleOptionSelected} />
    );
}