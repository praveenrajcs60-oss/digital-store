// API client utility

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = (data && data.error) || response.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/api/auth/me'),
  getDemoAccounts: () => request('/api/auth/demo-accounts'),

  // Products
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    return request(`/api/products?${searchParams.toString()}`);
  },
  getCategories: () => request('/api/products/categories'),
  getProduct: (idOrSlug) => request(`/api/products/${idOrSlug}`),

  // Reviews
  addReview: (reviewData) => request('/api/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),

  // Checkout
  createCheckoutSession: (payload) => request('/api/checkout/create-session', { method: 'POST', body: JSON.stringify(payload) }),
  getOrderStatus: (params) => {
    const searchParams = new URLSearchParams(params);
    return request(`/api/checkout/order-status?${searchParams.toString()}`);
  },

  // Orders
  getMyOrders: () => request('/api/orders/my-orders'),
  getDownloadUrl: (productId, orderId) => {
    const token = localStorage.getItem('token');
    let url = `/api/orders/download/${productId}`;
    const params = [];
    if (orderId) params.push(`orderId=${orderId}`);
    if (token) params.push(`token=${token}`);
    if (params.length) url += `?${params.join('&')}`;
    return url;
  },

  // Admin
  getAdminStats: () => request('/api/admin/stats'),
  getAdminOrders: () => request('/api/admin/orders'),
  createProduct: (productData) => request('/api/admin/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, updates) => request(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
};
