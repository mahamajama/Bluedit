import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import loadingTicker from '../../assets/loading_light.gif';

export default function Loading() {
    const [domReady, setDomReady] = useState(false);
    useEffect(() => {
        setDomReady(true);
    }, []);
    return (
        <>
        {domReady && createPortal(
            <div className="loadingContainer">
                <img 
                    src={loadingTicker}
                    className="loadingTicker"
                />
            </div>
            , document.body
        )}
        </>  
    );
}

