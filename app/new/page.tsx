"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const router = useRouter();

  const handleGenerateTitle = async () => {
    if (!content.trim()) {
      alert("先に本文を入力してください。");
      return;
    }

    try {
      setIsGeneratingTitle(true);

      const res = await fetch("/api/ai/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "タイトル生成に失敗しました。");
        return;
      }

      setTitle(data.title.split("\n")[0].trim());
    } catch (error) {
      console.error(error);
      alert("タイトル生成に失敗しました。");
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      alert("先にテーマを入力してください。");
      return;
    }

    try {
      setIsGeneratingContent(true);

      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "本文生成に失敗しました。");
        return;
      }

      setContent(data.content);
    } catch (error) {
      console.error(error);
      alert("本文生成に失敗しました。");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "保存に失敗しました。");
    return;
  }

  router.push("/");
  router.refresh();
  };
  

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">新しい記事を書く</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              本文生成用のテーマ
            </label>
            <input
              type="text"
              placeholder="例: 初心者がブログアプリを作ってみた感想"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGeneratingContent}
              className="rounded-lg border px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              {isGeneratingContent ? "AI本文生成中..." : "AIで本文生成"}
            </button>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">タイトル</label>
            <input
              type="text"
              placeholder="記事タイトルを入力"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border bg-white p-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">本文</label>
            <textarea
              placeholder="本文を入力"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border bg-white p-3 h-64"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={isGeneratingTitle}
              className="rounded-lg border px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              {isGeneratingTitle ? "AI生成中..." : "AIでタイトル生成"}
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              保存
            </button>

            <a href="/" className="rounded-lg border px-4 py-2 bg-white">
              戻る
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}