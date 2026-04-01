import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "コメント取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const postId = Number(id);
    const { author, content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "コメントは必須です。" },
        { status: 400 }
      );
    }

    const normalizedAuthor = author?.trim() || "匿名さん";

    const comment = await prisma.comment.create({
      data: {
        postId,
        author: normalizedAuthor,
        content: content.trim(),
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "コメント投稿に失敗しました。" },
      { status: 500 }
    );
  }
}
