import Comment from './Comment';

const commentLimit = 25;

export default function CommentsList({ comments }) {
    return (
        <div className="listContainer">
            {comments.filter(comment => comment.kind === "t1").slice(0, commentLimit).map(comment => {
                return (
                    <Comment 
                        comment={comment} 
                        key={comment.data.id}
                    />
                );
            })}
        </div>
    );
}

