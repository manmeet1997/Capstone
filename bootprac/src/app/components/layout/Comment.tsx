import axios from "axios";
import { useEffect, useState } from "react";


interface CommentPage {
  text: string;
  username: string;
  createdAt: Date;
}

const Comment = ({ id }: any) => {
  const [commentInfo, setCommentInfo] = useState<CommentPage[]>([]); // Changed null to []
  const [newComment, setNewComment] = useState<string>("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/news/id/${id}/comments`
        );
        console.log("Response data:", response.data);
        setCommentInfo(response.data.comments); // Assuming the response data is an object containing a 'comments' array
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim().length > 0) {
      try {
        const response = await axios.post(
          `http://localhost:3001/api/news/id/${id}/comments`,
          { text: newComment }
        );
        const newCommentData = response.data;

        setCommentInfo([...newCommentData.news.comments]);
        setNewComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      setErrMsg("Please leave a comment first!!");
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments</h3>
      <hr />

      {commentInfo.length > 0 ? (
        commentInfo.map((comment, index) => (
          <div key={index} className="mt-4 flex">
            <div className="flex-shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 pt-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
              <strong>{comment.username}</strong>{" "}
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()} {/* Updated */}
              </span>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No comments available.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-2 mt-8">
          <textarea
            placeholder="Add your comment"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setErrMsg(""); // Clear the error message
            }}
            className="w-full rounded border leading-normal resize-none h-20 py-2 px-3 font-medium focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-red-500">{errMsg}</div>
          <div className="flex justify-end">
            <input
              type="submit"
              className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500"
              value="Comment"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Comment;
