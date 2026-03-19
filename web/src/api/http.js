const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function request(path, options = {}) {
  const normalizedPath = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const response = await fetch(normalizedPath, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok || result.code >= 400) {
    throw new Error(result.message || "请求失败");
  }

  return result.data;
}
