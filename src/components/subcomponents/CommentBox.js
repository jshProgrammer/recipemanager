import React, { useState, useEffect } from "react";
import StarSelector from "./StarSelector";
import { useAuth } from "../../features/providers/AuthContext";
import "../../styles/CommentBox.css";

const CommentBox = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const { user } = useAuth();

    localStorage.removeItem("comments");
    localStorage.removeItem("ratings");

    useEffect(() => {
        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        if (storedComments[recipeId]) setComments(storedComments[recipeId]);
    }, [recipeId]);

    const addComment = () => {
        if (!newComment.trim() || selectedRating === 0) return;

        const newEntry = {
            text: newComment.trim(),
            rating: selectedRating,
            user: user?.displayName || "Anonymous",
            timestamp: new Date().toISOString()
        };
        const updatedComments = [...comments, newEntry];
        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        storedComments[recipeId] = updatedComments;
        localStorage.setItem("comments", JSON.stringify(storedComments));
        setComments(updatedComments);

        const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
        const existingRatings = Array.isArray(storedRatings[recipeId])
            ? storedRatings[recipeId]
            : [];
        const updatedRatings = [...existingRatings, selectedRating];
        storedRatings[recipeId] = updatedRatings;
        localStorage.setItem("ratings", JSON.stringify(storedRatings));

        setNewComment("");
        setSelectedRating(0);
    };

    const renderStaticStars = (count) => (
        <div>
            {[1, 2, 3, 4, 5].map((i) => (
                <i
                    key={i}
                    className={`bi ${i <= count ? "bi-star-fill" : "bi-star"} me-1`}
                    style={{ color: "#ffc107" }}
                />
            ))}
        </div>
    );

    return (
        <div className="mt-4">
            <h6 className="green fw-bold">Comments & Ratings</h6>

            <ul className="list-group mb-3">
                {comments.map((c, i) => (
                    <li key={i} className="list-group-item">
                        {renderStaticStars(c.rating)}
                        <div className="text-muted mb-1">{c.text}</div>
                        <small className="text-secondary">
                            {c.user} — {new Date(c.timestamp).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                        </small>
                    </li>
                ))}
            </ul>

            <div className="mb-2">
                <label className="green form-label fw-bold">Your Rating:</label>
                <StarSelector rating={selectedRating} setRating={setSelectedRating}/>
            </div>

            <div className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            selectedRating !== 0 &&
                            newComment.trim() !== ""
                        ) {
                            addComment();
                        }
                    }}
                />
                <button
                    className="btn btn-green"
                    onClick={addComment}
                    disabled={selectedRating === 0 || newComment.trim() === ""}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default CommentBox;