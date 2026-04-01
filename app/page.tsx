"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const totalChars = posts.reduce((sum, post) => sum + post.content.length, 0);
  const avgChars = posts.length > 0 ? Math.round(totalChars / posts.length) : 0;

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      loadPosts();
    } else {
      alert(data.error || "削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm backdrop-blur">
          <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-indigo-200/50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-sky-200/40 blur-2xl" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="relative">
              <p className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                My First AI Blog App
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                My Blog
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                AIと一緒に記事を育てる、シンプルで見やすいブログ。
              </p>
            </div>

            <Link
              href="/new"
              className="relative inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700"
            >
              新しい記事を書く
            </Link>
          </div>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Articles
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{posts.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Characters
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalChars}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg / Post
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{avgChars}</p>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-indigo-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-5xl">📝</div>
              <h2 className="text-2xl font-semibold text-slate-900">
                まだ記事がありません
              </h2>
              <p className="mt-3 text-slate-600">
                最初の記事を書いて、あなただけのブログを始めましょう。
              </p>
              <Link
                href="/new"
                className="mt-6 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                記事を作成する
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Post #{post.id}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      <Link
                        href={`/posts/${post.id}`}
                        className="transition group-hover:text-indigo-700"
                      >
                        {post.title}
                      </Link>
                    </h2>
                  </div>
                </div>

                <p className="line-clamp-4 whitespace-pre-wrap text-base leading-7 text-slate-600">
                  {post.content}
                </p>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  {post.content.length} characters
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/posts/${post.id}`}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    詳細を見る
                  </Link>

                  <Link
                    href={`/edit/${post.id}`}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    編集
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    削除
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}