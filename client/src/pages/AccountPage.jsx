import React, { useEffect, useState } from 'react';
import {
  FolderDown,
  DownloadCloud,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  User,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Flatten all purchased items for easy download access
  const allPurchasedItems = orders
    .filter(o => o.status === 'completed')
    .flatMap(order => order.items.map(item => ({ ...item, orderId: order.id, orderDate: order.createdAt })));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Account Info Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Customer Account
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <span className="text-slate-500 block">Total Orders</span>
            <span className="text-base font-bold text-white">{orders.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <span className="text-slate-500 block">Purchased Assets</span>
            <span className="text-base font-bold text-emerald-400">{allPurchasedItems.length}</span>
          </div>
        </div>
      </div>

      {/* Digital Download Vault */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <FolderDown className="w-5 h-5 text-blue-400" />
              <span>My Digital Download Vault</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access and re-download all your purchased software, boilerplates, and guides anytime.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-40 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
        ) : allPurchasedItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">You haven't purchased any digital assets yet.</p>
            <Link
              to="/catalog"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPurchasedItems.map((item, idx) => {
              const downloadUrl = api.getDownloadUrl(item.productId, item.orderId);
              return (
                <div
                  key={idx}
                  className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex-shrink-0">
                        Unlocked
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.downloadFileName || 'archive.zip'}</span>
                    </div>

                    {item.licenseKey && (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-sans">License:</span>
                        <code className="px-2 py-0.5 bg-slate-950 rounded border border-slate-800 text-[10px] text-blue-300 font-mono select-all">
                          {item.licenseKey}
                        </code>
                        <button
                          onClick={() => handleCopyKey(item.licenseKey)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Copy license key"
                        >
                          {copiedKey === item.licenseKey ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Purchased on {new Date(item.orderDate).toLocaleDateString()}
                    </span>

                    <a
                      href={downloadUrl}
                      download={item.downloadFileName || 'asset.zip'}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-blue-600/20"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white">Order History</h2>
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-400 font-semibold">{o.id}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {o.items.map((i) => i.title).join(', ')}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">${o.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
