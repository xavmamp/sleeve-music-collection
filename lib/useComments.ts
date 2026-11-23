"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export type Comment = {
  id: string;
  album_id: number;
  user_id: string;
  author_email: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export function useComments(albumId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();

    const subscription = supabase
      .channel(`comments:album_id=eq.${albumId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `album_id=eq.${albumId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [albumId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("comments")
        .select("*")
        .eq("album_id", albumId)
        .order("created_at", { ascending: false });

      if (err) throw err;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (userId: string, content: string, authorEmail: string) => {
    try {
      const { error: err } = await supabase.from("comments").insert([
        {
          album_id: albumId,
          user_id: userId,
          author_email: authorEmail,
          content,
          created_at: new Date().toISOString(),
        },
      ]);

      if (err) throw err;
      await fetchComments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add comment";
      setError(message);
      throw err;
    }
  };

  const updateComment = async (commentId: string, newContent: string) => {
    try {
      const { data, error: err } = await supabase
        .from("comments")
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq("id", commentId)
        .select();

      if (err) throw err;

      if (!data || data.length === 0) {
        throw new Error("No comment was updated. Check Supabase RLS policies.");
      }

      console.log("Updated comment:", data);

      await fetchComments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update comment";

      console.error("Update error:", message);
      setError(message);
      throw new Error(message);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error: err } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (err) throw err;
      await fetchComments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete comment";
      setError(message);
      throw err;
    }
  };

  return { comments, loading, error, addComment, updateComment, deleteComment };
}