import { useState, useEffect, useRef } from "react";

import { expandSection, collapseSection } from '../../utils/effects';
import PreviewButton from "./PreviewButton";

export default function Preview({ children, label, disabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const previewContainer = useRef(null);

    const handleClickPreview = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (isOpen) {
            previewContainer.current.classList.remove('collapsed');
            expandSection(previewContainer.current);
            //window.addEventListener("click", handleOutsideClick);
        } else {
            collapseSection(previewContainer.current, (element) => {
                element.classList.add('collapsed');
            });
        }
    }, [isOpen])

    return (
        <div className={`previewContainerContainer ${isOpen ? 'open' : ''}`}>
            <PreviewButton
                label={label}
                onClick={handleClickPreview}
                disabled={disabled}
                open={isOpen}
            />
            <div className={`previewContainer`} ref={previewContainer}>
                {children}
            </div>
        </div>
    );
}