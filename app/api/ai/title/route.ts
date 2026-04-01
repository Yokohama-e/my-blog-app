import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const client = new OpenAI({
      baseURL: "http://localhost:1234/v1",
      apiKey: "lm-studio",
    });

    const response = await client.responses.create({
      model: "google/gemma-3-4b",
      input: `次のブログ本文に合う、SEOに強い日本語タイトルを1つだけ作ってください。
条件:
・20〜35文字程度
・自然な日本語にする
・不自然な記号やキーワードの詰め込みをしない
・「初心者」「ブログアプリ」「作成」など、内容に合う重要語を必要なら入れる
・タイトルだけを返す
・記号の「｜」は使わない

本文:
${content}`,
    });

    return NextResponse.json({
      title: response.output_text.trim(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "タイトル生成に失敗しました。" },
      { status: 500 }
    );
  }
}