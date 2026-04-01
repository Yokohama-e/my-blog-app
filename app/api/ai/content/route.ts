import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const client = new OpenAI({
      baseURL: "http://localhost:1234/v1",
      apiKey: "lm-studio",
    });

    const response = await client.responses.create({
      model: "google/gemma-3-4b",
      input: `次のテーマに合う、日本語のブログ本文の下書きを作ってください。

条件:
・初心者にも読みやすい自然な日本語
・300〜500文字程度
・導入 → 本文 → まとめ の流れ
・見出しは不要
・実体験を書いたブログ記事のようにする
・抽象的すぎる表現は避ける
・「作ってみた」「やってみた」感想が伝わるようにする
・本文だけを返す

テーマ:
${prompt}`,
    });

    return NextResponse.json({
      content: response.output_text.trim(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "本文生成に失敗しました。" },
      { status: 500 }
    );
  }
}