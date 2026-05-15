const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bac-35ui.onrender.com/";
export const storageKeys = {
  token: "inventory_token",
  user: "inventory_user",
};
export function getStoredUser() {
  const rawUser = localStorage.getItem(storageKeys.user);
  return rawUser ? JSON.parse(rawUser) : null;
}
export function saveSession(session) {
  localStorage.setItem(storageKeys.token, session.access_token);
  localStorage.setItem(
    storageKeys.user,
    JSON.stringify({
      username: session.username,
      role: session.role,
    })
  );
}
export function clearSession() {
  localStorage.removeItem(storageKeys.token);
  localStorage.removeItem(storageKeys.user);
}
async function request(path, options = {}) {
  const token = localStorage.getItem(storageKeys.token);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (response.status === 204) {
    return null;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
}
export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
export const categoryApi = {
  list: () => request("/categories"),
  create: (payload) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),
};
export const productApi = {
  list: ({ categoryId, search } = {}) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category_id", categoryId);
    if (search) params.set("search", search);
    const query = params.toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  get: (id) => request(`/products/${id}`),
  create: (payload) =>
    request("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/products/${id}`, {
      method: "DELETE",
    }),
};
