import { NextResponse } from "next/server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, context: RouteContext) {
  if (!isAdminAuthorized(req)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    await prisma.comment.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "コメント削除に失敗しました。" },
      { status: 500 }
    );
  }
}
