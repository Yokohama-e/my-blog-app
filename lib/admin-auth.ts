import { NextResponse } from "next/server";

export function isAdminAuthorized(req: Request) {
  const expectedKey = process.env.ADMIN_API_KEY;
  const providedKey = req.headers.get("x-admin-key");

  if (!expectedKey) return false;
  return providedKey === expectedKey;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "管理者認証が必要です。" },
    { status: 401 }
  );
}
