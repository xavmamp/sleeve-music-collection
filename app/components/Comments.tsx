
"use client";

import { useAuth } from "@/lib/useAuth";
import { useComments } from "@/lib/useComments";
import Link from "next/link";
import { FormEvent, useState } from "react";

type CommentsProps = {
  albumId: number;
};

export function Comments({ albumId }: CommentsProps) {
  const { user, loading: authLoading } = useAuth();
  const {
    comments,
    loading: commentsLoading,
    error,
    addComment,
    updateComment,
    deleteComment,
  } = useComments(albumId);

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editingError, setEditingError] = useState("");

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim() || submitting) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      await addComment(user.id, content.trim(), user.email);
      setContent("");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to add comment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (comment: {
    id: string;
    content: string;
  }) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setEditingError("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
    setEditingError("");
  };

  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;

    setEditingError("");

    try {
      await updateComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Save error:", err);
      setEditingError(
        err instanceof Error ? err.message : "Failed to update comment"
      );
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isModified = (createdAt: string, updatedAt: string) => {
    if (!updatedAt) return false;

    const created = new Date(createdAt).getTime();
    const updated = new Date(updatedAt).getTime();

    return (
      Number.isFinite(created) &&
      Number.isFinite(updated) &&
      updated - created > 1000
    );
  };

  if (commentsLoading && !authLoading) {
    return (
      <div className="comments-section">
        Loading comments...
      </div>
    );
  }

  return (
    <section
      className="comments-section"
      aria-labelledby="comments-heading"
    >
      <h2 id="comments-heading">Comments</h2>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!authLoading && !user && (
        <div className="auth-prompt">
          <p>Sign in to add a comment</p>
          <Link href="/login" className="primary-link">
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {!authLoading && user && (
        <form
          onSubmit={handleSubmitComment}
          className="comment-form"
        >
          {submitError && (
            <div className="error-message">
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="comment-content">
              Add a comment
            </label>

            <textarea
              id="comment-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="What do you think about this album?"
              disabled={submitting}
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 && (
          <p className="no-comments">
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment) => (
          <article
            key={comment.id}
            className="comment-item"
          >
            <div className="comment-header">
              <span className="comment-author">
                {comment.author_email}
              </span>

              <span className="comment-date">
                {formatDate(comment.created_at)}

                {isModified(
                  comment.created_at,
                  comment.updated_at
                ) && (
                    <span
                      className="comment-modified"
                      title={`Last modified: ${formatDate(
                        comment.updated_at
                      )}`}
                    >
                      {" "}(Modified)
                    </span>
                  )}
              </span>

              {!authLoading &&
                user &&
                user.id === comment.user_id && (
                  <div className="comment-actions">
                    <button
                      type="button"
                      className="comment-btn comment-btn-edit"
                      onClick={() => handleEditStart(comment)}
                      disabled={editingId !== null}
                      aria-label="Edit comment"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="comment-btn comment-btn-delete"
                      onClick={() => handleDelete(comment.id)}
                      disabled={editingId !== null}
                      aria-label="Delete comment"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>

            {editingId === comment.id ? (
              <div className="comment-edit">
                {editingError && (
                  <div className="error-message">
                    {editingError}
                  </div>
                )}

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();

                      if (
                        editContent.trim() &&
                        editContent.trim() !== comment.content
                      ) {
                        handleEditSave(comment.id);
                      }
                    }
                  }}
                  rows={3}
                  className="comment-edit-textarea"
                />

                <div className="comment-edit-actions">
                  <button
                    type="button"
                    className="comment-btn comment-btn-save"
                    onClick={() =>
                      handleEditSave(comment.id)
                    }
                    disabled={
                      !editContent.trim() ||
                      editContent.trim() === comment.content
                    }
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="comment-btn comment-btn-cancel"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="comment-content">
                {comment.content}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}