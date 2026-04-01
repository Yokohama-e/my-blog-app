"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getAdminHeaders } from "@/lib/admin-client";

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

        setTitle(data.title ?? "");
        setContent(data.content ?? "");
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
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminHeaders = getAdminHeaders();
    if (!adminHeaders) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert(data.error || "更新に失敗しました。");
      }
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="aurora-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← トップへ戻る
          </Link>
        </div>

        <header className="relative mb-6 overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-6 text-white shadow-xl shadow-indigo-200/50 md:mb-8 md:p-8">
          <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-2xl" />
          <p className="mb-3 inline-block rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-white">
            Edit Post
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            記事を編集
          </h1>
          <p className="mt-3 text-base leading-7 text-indigo-50">
            タイトルと本文を修正して、記事内容を更新できます。
          </p>
        </header>

        <form
          onSubmit={handleUpdate}
          className="glass-card space-y-6 rounded-3xl p-5 md:space-y-8 md:p-8"
        >
          <section>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              タイトル
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              本文
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[320px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-slate-400"
            />
          </section>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 md:flex-row md:justify-end">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:w-auto"
            >
              キャンセル
            </Link>

            <button
              disabled={isSaving || isLoading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              {isLoading ? "読み込み中..." : isSaving ? "更新中..." : "更新する"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}