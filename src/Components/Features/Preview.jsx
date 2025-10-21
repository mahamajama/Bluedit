import { useState, useEffect, useRef } from "react";

import { expandSection, collapseSection } from '../../utils/effects';
import PreviewButton from "./PreviewButton";

export default function Preview({ children, label, disabled, onClickPreviewButton }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const previewContainer = useRef(null);
    const previewContent = useRef(null);

    const handleClickPreview = (e) => {
        if (onClickPreviewButton) onClickPreviewButton(e);
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (isOpen) {
            previewContainer.current.classList.remove('collapsed');
            previewContent.current.classList.add('open');
        } else {
            collapseSection(previewContainer.current, (element) => {
                element.classList.add('collapsed');
                element.children[0].classList.remove('open');
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && isLoaded) {
            expandSection(previewContainer.current);
        }
    }, [isOpen, isLoaded]);

    useEffect(() => {
        if (children) {
            const el = previewContent.current.children[0];
            if (el.tagName === 'IMG') {
                el.onload = function() {
                    setIsLoaded(true);
                }
            } else if (el.classList.contains('mediaEmbed')) {
                el.children[0].onload = () => {
                    setIsLoaded(true);
                }
            } else {
                setIsLoaded(true);
            }
        }
    }, [children]);

    return (
        <div className={`previewContainerContainer ${isOpen ? 'open' : ''}`}>
            <PreviewButton
                label={label}
                onClick={handleClickPreview}
                disabled={disabled}
                open={isOpen}
            />
            <div className={`previewContainer`} ref={previewContainer}>
                <div className={`previewContent`} ref={previewContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}