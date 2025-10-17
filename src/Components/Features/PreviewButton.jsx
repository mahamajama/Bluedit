import { useRef, useEffect } from "react";

import { ignoreTransformTransition } from "../../utils/effects";

export default function PreviewButton({ label, onClick, disabled, open }) {
    const previewButton = useRef(null);

    const handleClick = (e) => {
        e.preventDefault();
        
        if (disabled) {
            previewButton.current.style.animation = 'none';
            previewButton.current.offsetHeight;
            previewButton.current.style.animation = 'shake 0.8s forwards ease-out';
        } else {
            ignoreTransformTransition(previewButton.current, 'translate(0, 2px) scale(0.99)', 0.06);
        }

        onClick(e);
    }

    useEffect(() => {
        previewButton.current.setAttribute("aria-expanded", open);
    }, [open]);

    return (
        <>
            <button 
                className={`previewButton ${disabled ? 'disabled' : ''}`}
                onClick={handleClick} 
                ref={previewButton}
                type="button"
            >
                {label}<span className={`select-arrow ${open ? 'open' : ''}`}></span>
            </button>
        </>
    );
}