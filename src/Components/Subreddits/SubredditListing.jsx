import { Link } from 'react-router';

export default function SubredditListing({ data }) {
    return (
        <div className="listingContainer subredditListing">
            <Link className="subredditName">
                {data.display_name_prefixed}
            </Link>
            <p className="subredditDescription">
                {data.public_description}
            </p>
            {data.subscribers && 
                <p>
                    <span className="subredditSubscribers">{data.subscribers.toLocaleString()}</span>
                    &nbsp;{data.subscribers === 1 ? 'subscriber' : 'subscribers'}
                </p>
            }
        </div>
    );
}