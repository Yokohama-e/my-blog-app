"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();

      if (!data) {
        alert("記事が見つかりません");
        router.push("/");
        return;
      }

      setTitle(data.title ?? "");
      setContent(data.content ?? "");
    };

    if (id) {
      fetchPost();
    }
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("更新失敗");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">記事を編集</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 h-40"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          更新する
        </button>
      </form>
    </main>
  );
}