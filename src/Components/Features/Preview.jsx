import { useState, useEffect, useRef } from "react";

import { expandSection, collapseSection } from '../../utils/effects';
import PreviewButton from "./PreviewButton";

export default function Preview({ children, label, disabled, onClickPreviewButton }) {
    const [isOpen, setIsOpen] = useState(false);
    const previewContainer = useRef(null);

    const handleClickPreview = (e) => {
        if (onClickPreviewButton) onClickPreviewButton(e);
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (isOpen) {
            previewContainer.current.classList.remove('collapsed');
            expandSection(previewContainer.current);
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
                <div className="previewContent">
                    {children}
                </div>
            </div>
        </div>
    );
}