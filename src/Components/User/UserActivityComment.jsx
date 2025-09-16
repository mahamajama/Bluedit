

export default function UserActivityComment({ comment }) {
    return (
        <div className="listContainer">
            {comment.body}
        </div>
    );
}