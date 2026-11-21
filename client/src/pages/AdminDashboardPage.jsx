import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'

  // Modal State for New Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Software & Boilerplates',
    price: '',
    originalPrice: '',
    summary: '',
    description: '',
    features: '',
    fileName: '',
    format: 'ZIP Archive',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getAdminOrders()
      ]);
      setStats(statsRes.metrics);
      setProducts(productsRes.products || []);
      setOrders(ordersRes.orders || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this digital product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      if (stats) setStats({ ...stats, totalProducts: stats.totalProducts - 1 });
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    try {
      const created = await api.createProduct(newProduct);
      setProducts([created.product, ...products]);
      setIsModalOpen(false);
      setNewProduct({
        title: '',
        category: 'Software & Boilerplates',
        price: '',
        originalPrice: '',
        summary: '',
        description: '',
        features: '',
        fileName: '',
        format: 'ZIP Archive',
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'
      });
      loadAdminData();
    } catch (err) {
      setFormError(err.message || 'Failed to create product');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Administrator Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Store Analytics & Management</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Digital Product</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">${stats.totalRevenue}</p>
            <span className="text-[11px] text-emerald-400 font-medium">From completed orders</span>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalOrders}</p>
            <span className="text-[11px] text-blue-400 font-medium">{stats.completedOrders} completed</span>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Active Products</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalProducts}</p>
            <span className="text-[11px] text-slate-400">Live in catalog</span>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Registered Buyers</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalCustomers}</p>
            <span className="text-[11px] text-slate-400">Customer accounts</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold transition-colors relative ${
            activeTab === 'products' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Manage Products ({products.length})</span>
          {activeTab === 'products' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold transition-colors relative ${
            activeTab === 'orders' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>All Customer Orders ({orders.length})</span>
          {activeTab === 'orders' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Products Table View */}
      {activeTab === 'products' && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Badge</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-10 object-cover rounded-lg bg-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {p.fileDetails ? p.fileDetails.fileName : 'asset.zip'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-white">${p.price}</td>
                    <td className="px-6 py-4">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-400">★ {p.rating}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Table View */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-blue-400">{o.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{o.customerName}</p>
                      <p className="text-[10px] text-slate-400">{o.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      {o.items.map((i) => i.title).join(', ')}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">${o.totalAmount}</td>
                    <td className="px-6 py-4 text-slate-400">{o.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Add New Digital Download Asset</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Supabase + Next.js SaaS Kit"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Software & Boilerplates">Software & Boilerplates</option>
                    <option value="UI & Design Kits">UI & Design Kits</option>
                    <option value="E-Books & Guides">E-Books & Guides</option>
                    <option value="Templates & Tools">Templates & Tools</option>
                    <option value="Website Templates">Website Templates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge</label>
                  <select
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="New">New</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Popular">Popular</option>
                    <option value="Staff Pick">Staff Pick</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="49"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original Price ($USD strike-through)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="89"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Summary</label>
                <input
                  type="text"
                  required
                  value={newProduct.summary}
                  onChange={(e) => setNewProduct({ ...newProduct, summary: e.target.value })}
                  placeholder="One sentence value proposition..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Features (one per line)</label>
                <textarea
                  rows={3}
                  value={newProduct.features}
                  onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                  placeholder="Next.js 14 App Router&#10;Stripe subscriptions setup&#10;Full TypeScript support"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Download File Name</label>
                  <input
                    type="text"
                    value={newProduct.fileName}
                    onChange={(e) => setNewProduct({ ...newProduct, fileName: e.target.value })}
                    placeholder="my-asset-bundle-v1.zip"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">File Format</label>
                  <input
                    type="text"
                    value={newProduct.format}
                    onChange={(e) => setNewProduct({ ...newProduct, format: e.target.value })}
                    placeholder="ZIP Archive / PDF / FIG"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {formError}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  {formSubmitting ? 'Creating...' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
