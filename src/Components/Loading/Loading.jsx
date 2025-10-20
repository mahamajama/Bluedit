import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Loading() {
    const [domReady, setDomReady] = useState(false);
    useEffect(() => {
        setDomReady(true);
    }, []);
    return (
        <>
        {domReady && createPortal(
            <div className="loadingContainer">
                
            </div>
            , document.body
        )}
        </>  
    );
}

