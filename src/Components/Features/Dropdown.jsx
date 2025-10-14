import { useRef, useState, useEffect, createRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './dropdown.css';
import { expandSection, collapseSection, ignoreTransformTransition } from '../../utils/effects';

export default function Dropdown({ onOptionSelected, options }) {
    const [selection, setSelection] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [optionsToRender, setOptionsToRender] = useState([]);

    const container = useRef(null);
    const selectButton = useRef(null);
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
        dropdown.current.classList.toggle("hidden", !isOpen);
        selectButton.current.setAttribute("aria-expanded", isOpen);

        if (isOpen) {
            expandSection(dropdown.current);
            window.addEventListener("click", handleOutsideClick);
        } else {
            collapseSection(dropdown.current);
        }
    }, [isOpen])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOption = (e) => {
        const value = e.target.getAttribute('data-value');
        setSelection(e.target.textContent);
        onOptionSelected(value);
        setIsOpen(false);
        ignoreTransformTransition(selectButton.current, 'translate(0, 2px) scale(0.99)', 0.06);
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
            <button className="select-button" onClick={toggleDropdown} ref={selectButton}>
                {selection}
                <span className="arrow"></span>
            </button>
            <menu className="select-dropdown hidden" ref={dropdown}>
                {optionsToRender}
            </menu>
        </div>
        </>
    );
}