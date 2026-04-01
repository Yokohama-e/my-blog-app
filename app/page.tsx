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

    if (res.ok) {
      loadPosts(); // 再読み込み
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Blog</h1>
          <p className="text-gray-600">はじめて作るブログアプリ</p>
        </header>

        <div className="mb-6">
          <Link
            href="/new"
            className="inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            新しい記事を書く
          </Link>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-gray-600">まだ記事がありません。</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* ボタンエリア */}
                <div className="flex gap-4 mt-4">
                  <Link
                    href={`/edit/${post.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    編集
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}