import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export default function U() {
    const navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        const path = '/user' + location.pathname.slice(2);
        navigate(path);
    }, []);

    return null;
}