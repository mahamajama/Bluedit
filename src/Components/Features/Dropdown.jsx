import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './dropdown.css';
import { expandSection, collapseSection } from '../../utils/effects';
import { isEmpty } from '../../utils/helpers';
import PreviewButton from './PreviewButton';

export default function Dropdown({ onOptionSelected, options, currentSelection }) {
    const [selection, setSelection] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [optionsToRender, setOptionsToRender] = useState([]);

    const container = useRef(null);
    const dropdown = useRef(null);

    function getOptionsToRender() {
        let arr = [];
        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
            const label = keys[i];
            const value = options[label];
            arr.push(
                <li 
                    className={selection === label ? 'selection' : ''}
                    data-value={value} 
                    onClick={handleClickOption} 
                    key={uuidv4()}
                >
                    {label}
                </li>
            );
            if (selection === '' && i === 0) {
                setSelection(label);
            }
        }
        return arr;
    }

    useEffect(() => {
        if (options) {
            setOptionsToRender(getOptionsToRender());
        }
    }, [options]);

    useEffect(() => {
        if (isOpen) {
            dropdown.current.classList.remove('hidden');
            expandSection(dropdown.current);
            window.addEventListener("click", handleOutsideClick);
        } else {
            collapseSection(dropdown.current, (element) => {
                element.classList.add('hidden');
            });
        }
    }, [isOpen])

    useEffect(() => {
        if (options && !isEmpty(options) && currentSelection) {
            if (currentSelection === 'default') {
                setSelection(Object.keys(options)[0]);
            } else {
                setSelection(currentSelection);
            }
        }
    }, [currentSelection, options]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOption = (e) => {
        setSelection(e.target.textContent);
        onOptionSelected(e);
        setIsOpen(false);
    }

    const handleOutsideClick = (e) => {
        if (container.current && isOpen) {
            const isOutsideClick = !container.current.contains(e.target);
            if (isOutsideClick) {
                setIsOpen(false);
                window.removeEventListener("click", handleOutsideClick);
            }
        }
    }

    return (
        <>
        <div className="custom-select" ref={container}>
            <PreviewButton
                label={selection}
                onClick={toggleDropdown}
                disabled={false}
                open={isOpen}
            />
            <menu className="select-dropdown hidden" ref={dropdown}>
                {optionsToRender}
            </menu>
        </div>
        </>
    );
}