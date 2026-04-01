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

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();

        if (!res.ok || !data) {
          alert(data?.error || "記事が見つかりません");
          router.push("/");
          return;
        }

        setPost(data);
      } catch (error) {
        console.error(error);
        alert("記事の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
    setIsAdminMode(hasStoredAdminKey());
  }, [id, router]);

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
      </div>
    </main>
  );
}