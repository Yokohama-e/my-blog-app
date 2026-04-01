"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

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

    try {
      setIsSaving(true);
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← トップへ戻る
          </Link>
        </div>

        <header className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm backdrop-blur">
          <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-indigo-200/50 blur-2xl" />
          <p className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            Edit Post
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            記事を編集
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            タイトルと本文を修正して、記事内容を更新できます。
          </p>
        </header>

        <form
          onSubmit={handleUpdate}
          className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
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
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              キャンセル
            </Link>

            <button
              disabled={isSaving || isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "読み込み中..." : isSaving ? "更新中..." : "更新する"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}