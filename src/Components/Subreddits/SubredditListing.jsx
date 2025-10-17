import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { isImage } from '../../utils/helpers';

export default function SubredditListing({ data }) {
    const [background, setBackground] = useState('');
    const container = useRef(null);
    const backgroundRef = useRef(null);

    function cleanBackgroundImageUrl(dirty) {
        const clean = dirty.split('?', 1)[0];
        return clean;
    }

    useEffect(() => {
        if (container.current && data.banner_background_image) {
            const url = cleanBackgroundImageUrl(data.banner_background_image);
            if (isImage(url)) {
                var bg = new Image();
                bg.src = url;
                bg.onload = () => {
                    setBackground(url);
                }
            }
        }
    }, [container.current]);

    useEffect(() => {
        if (backgroundRef.current && background) {
            backgroundRef.current.classList.add('loaded');
        }
    }, [background]);

    return (
        <div className="listingContainer subredditListing" ref={container}>
            {background && <img className="subredditListingBackground" src={background} ref={backgroundRef} />}
            <div className="subredditNameContainer">
                {data.icon_img && 
                    <img className="subredditIcon" src={data.icon_img} />
                }
                <Link className="subredditName" to={data.display_name_prefixed}>
                    {data.display_name_prefixed}
                </Link>
            </div>
            {data.public_description &&
                <p className="subredditDescription">
                    {data.public_description}
                </p>
            }
            {data.subscribers && 
                <p>
                    <span className="subredditSubscribers">{data.subscribers.toLocaleString()}</span>
                    &nbsp;{data.subscribers === 1 ? 'subscriber' : 'subscribers'}
                </p>
            }
        </div>
    );
}