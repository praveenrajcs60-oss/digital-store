import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  DownloadCloud,
  Copy,
  Check,
  FolderDown,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId && !sessionId) {
        setError('No order identifier specified');
        setLoading(false);
        return;
      }
      try {
        const data = await api.getOrderStatus({ order_id: orderId, session_id: sessionId });
        setOrder(data.order);
      } catch (err) {
        setError(err.message || 'Failed to retrieve order confirmation');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, sessionId]);

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Verifying payment & generating secure download tokens...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-lg font-bold text-white">Order Details Not Found</p>
        <p className="text-xs text-slate-400">{error || 'Could not locate your purchase confirmation.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Verified & Assets Unlocked</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Thank You For Your Order!</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Order <strong className="text-white font-mono">{order.id}</strong> was completed successfully. Your digital assets are ready for immediate download below.
        </p>
      </div>

      {/* Instant Downloads Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-blue-400" />
              <span>Instant Digital Downloads</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click below to download source archives, guides, and tokens</p>
          </div>
          <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg">
            {order.items.length} Asset{order.items.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const downloadUrl = api.getDownloadUrl(item.productId, order.id);
            return (
              <div
                key={idx}
                className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      {item.downloadFileName || 'archive.zip'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400">Paid: ${item.price}</span>
                  </div>

                  {/* License Key Box */}
                  {item.licenseKey && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-sans">License Key:</span>
                      <code className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-[11px] text-blue-300 font-mono select-all">
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

                {/* Direct Download Button */}
                <a
                  href={downloadUrl}
                  download={item.downloadFileName || 'asset.zip'}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all flex-shrink-0 active:scale-95"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download Now</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
        <div className="text-slate-400 space-y-1">
          <p>
            Receipt sent to: <strong className="text-white">{order.customerEmail}</strong>
          </p>
          <p>
            Payment method: <span className="text-slate-300">{order.paymentMethod}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/account"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors"
          >
            <FolderDown className="w-4 h-4 text-blue-400" />
            <span>Go to My Downloads</span>
          </Link>
          <Link
            to="/catalog"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-md shadow-blue-600/20"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
