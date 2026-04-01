"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

    const foundPost = posts.find(
      (p) => p.id.toString() === params.id
    );

    if (foundPost) {
      setTitle(foundPost.title);
      setContent(foundPost.content);
    }

    setLoaded(true);
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const savedPosts = localStorage.getItem("posts");
    const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

    const updatedPosts = posts.map((post) =>
      post.id.toString() === params.id
        ? { ...post, title, content }
        : post
    );

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    router.push("/");
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <p>読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← トップページへ戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">記事を編集する</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">本文</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border bg-white p-3 h-64"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              更新する
            </button>

            <Link
              href="/"
              className="rounded-lg border px-4 py-2 bg-white"
            >
              戻る
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}