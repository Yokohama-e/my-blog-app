import { NextResponse } from "next/server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json(
        { error: "記事が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  if (!isAdminAuthorized(req)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const { title, content } = await req.json();

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: title?.trim(),
        content: content?.trim(),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  if (!isAdminAuthorized(req)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 }
    );
  }
}