import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function SafeSearchToggle() {
    const [params, setParams] = useSearchParams();
    const [safeSearchOn, setSafeSearchOn] = useState(false);

    function handleChange(e) {
        console.log(e.target.value);
        if (safeSearchOn) {
            setSafeSearchOn(false);
            setParams((params) => {
                params.set("include_over_18", "on")
                return params;
            });
        } else {
            setSafeSearchOn(true);
            setParams((params) => {
                params.delete("include_over_18")
                return params;
            });
        }
    }

    return (
        <>
            <label className="safeSearchToggle">
                SafeSearch:&nbsp;
                <input 
                    type="checkbox" 
                    name="safeSearch"
                    value={safeSearchOn}
                    onChange={handleChange}
                    className="safeSearch"
                />
            </label>
        </>
    );
}