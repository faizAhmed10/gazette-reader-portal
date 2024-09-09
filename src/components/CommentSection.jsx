import React, { useState, useCallback, useContext } from "react";
import CommentForm from "./CommentForm";
import ReaderContext from "../utils/ReaderContext";

const CommentSection = ({
  comments,
  handleDelete,
  handleCommentSubmit,
  replyingTo, 
  setReplyingTo,
  getComments,
  hasMore,
  setHasMore,
  setComments,
  id,
  box,
  setBox
}) => {
  const [showReplies, setShowReplies] = useState({});
  const [page, setPage] = useState(1); // Track current page
  let {authTokens, readerName, backendUrl} = useContext(ReaderContext)

  const handleReplyClick = (comment) => {
    setReplyingTo(comment);
    setBox(!box)
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const fetchMoreComments = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}api/reader/comments/get/${id}?page=${page + 1}&page_size=5`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data.results)) {
        setComments((prevComments) => {
          const newComments = data.results.filter(
            (newComment) => !prevComments.some((prevComment) => prevComment.id === newComment.id)
          );

          newComments.forEach((comment) => {
            if (comment.parent) {
              const parentIndex = prevComments.findIndex((c) => c.id === comment.parent);
              if (parentIndex !== -1) {
                prevComments[parentIndex].replies = [
                  ...(prevComments[parentIndex].replies || []),
                  comment,
                ];
              } else {
                prevComments.push(comment);
              }
            } else {
              prevComments.push(comment);
            }
          });

          return [...prevComments];
        });

        setPage((prevPage) => prevPage + 1);
        setHasMore(data.next !== null)
      }
    } catch (error) {
      console.error("Error fetching more comments:", error);
    }
  }, [page]);

  const renderComments = (comments) => {

    return comments.map((comment) => (
      <div key={comment.id} className="bg-slate-300 my-2 rounded p-3">
        <p className="font-bold">{comment.user}</p>
        <p>{comment.comment}</p>
        <button onClick={() => handleReplyClick(comment)}
        className="text-blue-600 mx-2"
        >Reply</button>
        {comment.user === readerName && 
        <button onClick={() => handleDelete(comment.id)}
        className="text-red-600 mx-2"
        >Delete</button>}

        {comment.replies && comment.replies.length > 0 && (
          <button onClick={() => toggleReplies(comment.id)} className="text-green-800 mx-2">
            {showReplies[comment.id] ? "Hide Replies" : "Show Replies"}
          </button>
        )}

        {!box && replyingTo && replyingTo.id === comment.id && (
          <CommentForm
            onCommentSubmit={handleCommentSubmit}
            parentComment={replyingTo}
            placeholder="Your Reply"
          />
        )}

        {showReplies[comment.id] && comment.replies && (
          <div className="">
            {renderComments(comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      {renderComments(comments)}
      {hasMore && comments.length > 0 ? (
        <button onClick={fetchMoreComments} className="bg-blue-400 my-2 text-white p-2 rounded">
          Load More Comments
        </button>
      ) : <strong className="my-5">No comments yet</strong>}
    </div>
  );
};

export default CommentSection;
