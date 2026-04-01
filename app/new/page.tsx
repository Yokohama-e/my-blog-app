"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function NewPostPage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      alert("本文生成用のテーマを入力してください。");
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

      setTitle(data.title.trim());
    } catch (error) {
      console.error(error);
      alert("タイトル生成に失敗しました。");
    } finally {
      setIsGeneratingTitle(false);
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
            Create New Post
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            新しい記事を書く
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            AIで本文やタイトルを補助しながら、ブログ記事を作成できます。
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                AIで本文を作る
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                テーマを入力すると、AIが本文の下書きを作成します。
              </p>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              本文生成用のテーマ
            </label>
            <input
              type="text"
              placeholder="例: 初心者がブログアプリを作ってみた感想"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
            />

            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGeneratingContent}
              className="mt-4 inline-flex rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingContent ? "AI本文生成中..." : "AIで本文生成"}
            </button>
          </section>

          <section>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              タイトル
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="記事タイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />

              <button
                type="button"
                onClick={handleGenerateTitle}
                disabled={isGeneratingTitle}
                className="shrink-0 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGeneratingTitle ? "AI生成中..." : "AIでタイトル生成"}
              </button>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              本文
            </label>
            <textarea
              placeholder="本文を入力"
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
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              保存する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}