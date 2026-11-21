import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
  Zap,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    discountCode,
    total,
    applyDiscount
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user ? user.email : '');
  const [name, setName] = useState(user ? user.name : '');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoStatus, setPromoStatus] = useState(null);
  const [useRealStripe, setUseRealStripe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyDiscount(promoCodeInput);
    setPromoStatus(res);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide a valid email address for digital asset delivery.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity || 1 })),
        customerEmail: email.trim(),
        customerName: name.trim() || 'Valued Customer',
        discountCode,
        useRealStripe,
        clientOrigin: window.location.origin
      };

      const res = await api.createCheckoutSession(payload);

      // If Stripe Checkout Session
      if (res.type === 'stripe' && res.url) {
        clearCart();
        window.location.href = res.url;
        return;
      }

      // If Simulator Checkout
      if (res.type === 'simulator' && res.orderId) {
        clearCart();
        navigate(`/checkout/success?order_id=${res.orderId}`);
        return;
      }

      throw new Error('Unexpected checkout response from server');
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Explore our collection of boilerplate codebases, Figma design systems, and architecture guides.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <span>Browse Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold text-white">Checkout & Order Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Cart Items & Customer Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Table */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span>Selected Digital Assets ({cartItems.length})</span>
              <button
                onClick={clearCart}
                className="text-xs text-slate-500 hover:text-red-400 font-normal transition-colors"
              >
                Clear Cart
              </button>
            </h2>

            <div className="divide-y divide-slate-800">
              {cartItems.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-16 object-cover rounded-xl bg-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.slug || item.id}`}
                      className="text-sm font-bold text-white hover:text-blue-400 truncate block"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-400">{item.category}</p>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Instant Digital Download
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-white">${item.price}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 text-xs mt-1 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details Form */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Delivery Information</h3>
            <p className="text-xs text-slate-400">
              Your download links and software license keys will be generated for this account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address (Required)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white">Order Summary</h3>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Promo code (WELCOME20)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoStatus && (
                <p className={`text-xs ${promoStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoStatus.message}
                </p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-200 font-semibold">${subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountCode})</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Digital Delivery Fee</span>
                <span className="text-emerald-400 font-semibold">FREE (Instant)</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-white pt-3 border-t border-slate-800">
                <span>Total Due</span>
                <span className="text-blue-400">${total}</span>
              </div>
            </div>

            {/* Checkout Options Toggle */}
            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Payment Mode</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stripeToggle"
                  checked={useRealStripe}
                  onChange={(e) => setUseRealStripe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="stripeToggle" className="text-xs text-slate-300 cursor-pointer">
                  Use Real Stripe Checkout Session (if keys configured)
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                {useRealStripe
                  ? 'Redirects to live Stripe hosted checkout.'
                  : 'Fast Simulator Mode: Generates real order, instant file download links, and license keys without credit card charges.'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Complete Purchase Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              {loading ? (
                <span>Generating Order & Downloads...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Complete Purchase (${total})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Digital Delivery • 100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
