"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getAdminHeaders, hasStoredAdminKey } from "@/lib/admin-client";

type Post = {
  id: number;
  title: string;
  content: string;
};

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch(`/api/posts/${id}/comments`),
        ]);
        const data = await postRes.json();

        if (!postRes.ok || !data) {
          alert(data?.error || "記事が見つかりません");
          router.push("/");
          return;
        }

        setPost(data);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (error) {
        console.error(error);
        alert("記事の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPostAndComments();
    }
    setIsAdminMode(hasStoredAdminKey());
  }, [id, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert("コメントを入力してください。");
      return;
    }

    try {
      setIsSubmittingComment(true);
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: author.trim() || "匿名さん",
          content: commentText,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "コメント投稿に失敗しました。");
        return;
      }

      setComments((prev) => [data, ...prev]);
      setCommentText("");
    } catch (error) {
      console.error(error);
      alert("コメント投稿に失敗しました。");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("このコメントを削除しますか？")) return;
    const adminHeaders = getAdminHeaders();
    if (!adminHeaders) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: adminHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "コメント削除に失敗しました。");
        return;
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error(error);
      alert("コメント削除に失敗しました。");
    }
  };

  const handleDelete = async () => {
    if (!confirm("この記事を削除しますか？")) return;
    const adminHeaders = getAdminHeaders();
    if (!adminHeaders) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: adminHeaders,
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "削除に失敗しました。");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="aurora-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← トップへ戻る
          </Link>
        </div>

        <article className="glass-card rounded-3xl p-8">
          <p className="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
            Post Detail
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {isLoading ? "読み込み中..." : post?.title}
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            {post ? `Post #${post.id} ・ ${post.content.length} characters` : ""}
          </p>

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-700">
            {isLoading ? "記事を読み込んでいます..." : post?.content}
          </div>

          {isAdminMode ? (
            <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <Link
                href={`/edit/${id}`}
                className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                編集する
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
                className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除する"}
              </button>
            </div>
          ) : (
            <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
              公開モードでは編集・削除は表示されません。
            </p>
          )}
        </article>

        <section className="glass-card mt-8 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-900">コメント</h2>
          <p className="mt-2 text-sm text-slate-500">
            感想や質問を気軽に残してください。
          </p>

          <form onSubmit={handleSubmitComment} className="mt-6 space-y-4">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="ニックネーム（任意）"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを書く"
              className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300"
            />
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmittingComment ? "投稿中..." : "コメントを投稿"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500">まだコメントはありません。</p>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{comment.author}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleString("ja-JP")}
                      </p>
                    </div>
                    {isAdminMode ? (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        削除
                      </button>
                    ) : null}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {comment.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}