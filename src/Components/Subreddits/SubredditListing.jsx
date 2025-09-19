

export default function SubredditListing({ data }) {
    return (
        <div className="listingContainer">
            <div>
                {data.display_name_prefixed}
            </div>
            <div>
                {data.public_description}
            </div>
            <div>
                {data.subscribers && data.subscribers.toLocaleString()}
            </div>
        </div>
    );
}