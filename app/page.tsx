"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminHeaders, hasStoredAdminKey } from "@/lib/admin-client";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const totalChars = posts.reduce((sum, post) => sum + post.content.length, 0);
  const avgChars = posts.length > 0 ? Math.round(totalChars / posts.length) : 0;

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
    setIsAdminMode(hasStoredAdminKey());
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    const adminHeaders = getAdminHeaders();
    if (!adminHeaders) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: adminHeaders,
    });

    const data = await res.json();

    if (res.ok) {
      loadPosts();
    } else {
      alert(data.error || "削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ede9fe,_#dbeafe_35%,_#ffffff_70%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <header className="relative mb-6 overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-6 text-white shadow-xl shadow-indigo-200/60 md:mb-8 md:p-8">
          <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-fuchsia-300/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-cyan-300/30 blur-2xl" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="relative">
              <p className="mb-3 inline-block rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                50代からのAIと学ぶ開発ログ
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-5xl">
                50代からのAI開発記録
              </h1>
              <p className="mt-3 text-base leading-7 text-indigo-50">
                AIと一緒に記事を育てる、やさしくて少し楽しいブログ。
              </p>
            </div>

            {isAdminMode ? (
              <Link
                href="/new"
                className="relative inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 md:w-auto"
              >
                新しい記事を書く
              </Link>
            ) : null}
          </div>
        </header>

        <section className="glass-card mb-8 grid overflow-hidden rounded-3xl md:mb-10 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <p className="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700">
              Featured Story
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              AIと一緒に、50代からの開発を楽しむ
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              つまずきも含めて全部コンテンツに。毎日の小さな進歩を記録するブログです。
            </p>
          </div>
          <div className="relative min-h-[180px] md:min-h-[220px]">
            <img
              src="https://picsum.photos/seed/ai-blog-hero/900/600"
              alt="ブログのメインイメージ"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mb-8 grid gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">
              Articles
            </p>
            <p className="mt-2 text-3xl font-bold text-violet-700">{posts.length}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">
              Characters
            </p>
            <p className="mt-2 text-3xl font-bold text-sky-700">{totalChars}</p>
          </div>
          <div className="rounded-2xl border border-fuchsia-100 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-500">
              Avg / Post
            </p>
            <p className="mt-2 text-3xl font-bold text-fuchsia-700">{avgChars}</p>
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
              {isAdminMode ? (
                <Link
                  href="/new"
                  className="mt-6 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  記事を作成する
                </Link>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 md:gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-md transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl md:p-6"
              >
                <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-3xl">
                  <img
                    src={`https://picsum.photos/seed/post-${post.id}/900/420`}
                    alt={`${post.title} のサムネイル`}
                    className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 md:h-44"
                  />
                </div>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="mb-2 text-sm font-medium text-violet-400">
                      Post #{post.id}
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                      <Link
                        href={`/posts/${post.id}`}
                        className="transition group-hover:text-violet-700"
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
                  {isAdminMode ? (
                    <>
                      <Link
                        href={`/edit/${post.id}`}
                        className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
                      >
                        編集
                      </Link>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        削除
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        )}
        {!isAdminMode ? (
          <p className="mt-6 text-center text-xs text-slate-400">
            公開モードでは編集・削除は表示されません。
          </p>
        ) : null}
      </div>
    </main>
  );
}