
import SubredditListing from './SubredditListing';

export default function SubredditsList({ subreddits }) {
    return (
        <div className="listContainer">
            {subreddits.map(sub => {
                return <SubredditListing data={sub.data} key={sub.data.id}/>;
            })}
        </div>
    );
}