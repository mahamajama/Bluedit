import { useRef, useState, useEffect } from "react";

import { ignoreTransformTransition } from "../../utils/effects";

export default function PreviewButton({ label, onClick, disabled }) {
    const previewButton = useRef(null);

    const handleClick = (e) => {
        e.preventDefault();
        
        if (disabled) {
            previewButton.current.style.animation = 'none';
            previewButton.current.offsetHeight;
            previewButton.current.style.animation = 'shake 0.8s forwards ease-out';
        } else {
            ignoreTransformTransition(previewButton.current, 'translate(0, 2px) scale(0.99)', 0.05);
        }

        onClick();
    }

    return (
        <>
            <button 
                className={`previewButton ${disabled ? 'disabled' : ''}`}
                onClick={handleClick} 
                ref={previewButton}
            >
                {label}
            </button>
        </>
    );
}