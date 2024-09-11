import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReaderContext from "../utils/ReaderContext";
import Loader from "../utils/Loader";
import CommentSection from "../components/CommentSection";
import CommentForm from "../components/CommentForm";
import { toast } from "react-toastify";

const Article = () => {
  const { id } = useParams();
  const { authTokens, backendUrl, cloudinaryUrl } = useContext(ReaderContext);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); 
  const [box, setBox] = useState(true)

  const getArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}api/reader/article/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setArticle(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}api/reader/comments/get/${id}?page=${pageNumber}&page_size=5`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      } 
      
      const data = await response.json();


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

        setPage(pageNumber);
        setHasMore(data.next !== null);
      } else {
        setComments([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (commentText, parent = null) => {
    try {
      const response = await fetch(`${backendUrl}api/reader/comments/create/${id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentText,
          parent: parent ? parent.id : null,
        }),
      });
 
      if (response.status === 201) {
        setReplyingTo(null); // Reset replyingTo after a successful comment submission
        toast.success("Comment posted successfully!")
        getComments(page);
      } else {
        const data = await response.json();
        toast.error("Failed to post comment, please try again");
        console.error("Failed to post comment:", data.detail);
      }
    } catch (error) {
      toast.error("Error posting comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`${backendUrl}api/reader/comments/delete/${commentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        getComments(page); // Re-fetch comments after deletion
        // window.location.reload()
        toast.success("Comment deleted successfully")
      } else {
        toast.error("Failed to delete comment, please try again");
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      toast.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    getArticle();
    getComments();
  }, [id]);

  return (
    <div className="lg:w-[90%] mx-auto p-4 bg-black bg-opacity-30">
      {loading && <Loader />}
      {article && (
        <div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">{article.author?.name}</p>
            <p className="font-semibold border rounded p-2">
              {article.category?.name}
            </p>
          </div>
          <h2 className="font-extrabold text-4xl lg:text-6xl my-2">{article.title}</h2>
          <p className="font-bold text-2xl lg:text-3xl my-2">{article.sub_title}</p>
          {article.image && (
            <img
            className="block rounded w-full h-auto max-h-[700px] object-cover"
            src={`${cloudinaryUrl}${article.image}`}
              alt="loading..."
            />
          )}
          <p
            className="text-xl font-semibold my-3"
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></p>
          <p className="text-right my-2">
            {new Date(article.publish_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p className="font-bold text-2xl">Comments</p>
          <CommentSection
            comments={comments}
            handleDelete={handleDelete}
            handleCommentSubmit={handleCommentSubmit}
            replyingTo={replyingTo} // Pass replyingTo state
            setReplyingTo={setReplyingTo} // Pass setReplyingTo function
            getComments={getComments}
            hasMore={hasMore}
            id={id}
            setComments={setComments}
            setHasMore={setHasMore}
            box={box}
            setBox={setBox}
          />
          {/* Display CommentForm only if no comment is being replied to */}
          {box && (
            <CommentForm onCommentSubmit={handleCommentSubmit} />
          )}
        </div>
      )}
    </div>
  );
};

export default Article;
