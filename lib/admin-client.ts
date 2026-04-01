const ADMIN_KEY_STORAGE = "blog_admin_key";

export function hasStoredAdminKey() {
  return Boolean(window.localStorage.getItem(ADMIN_KEY_STORAGE));
}

export function getAdminHeaders() {
  const cachedKey = window.localStorage.getItem(ADMIN_KEY_STORAGE);
  const key =
    cachedKey ??
    window.prompt("管理者キーを入力してください（保存はブラウザ内のみ）")?.trim();

  if (!key) return null;
  if (!cachedKey) {
    window.localStorage.setItem(ADMIN_KEY_STORAGE, key);
  }

  return {
    "x-admin-key": key,
  };
}
