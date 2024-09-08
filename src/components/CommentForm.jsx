import React, { useState } from "react";

const CommentForm = ({ onCommentSubmit, parentComment, placeholder = "Add a comment..." }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(commentText, parentComment);
      setCommentText(""); // Clear the input after submitting
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={placeholder}
        className="rounded p-2 lg:w-[70%]"
        rows="4"
        required
      ></textarea>
      <button type="submit"
      className="bg-green-500 p-2 text-white rounded mr-auto mt-2"
      >Submit</button>
    </form>
  );
};

export default CommentForm;
