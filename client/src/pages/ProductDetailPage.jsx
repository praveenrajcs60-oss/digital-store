import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  DownloadCloud,
  Check,
  ShieldCheck,
  FileCheck,
  Zap,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  HardDrive,
  FileCode,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection';

export default function ProductDetailPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(idOrSlug);
      setProduct(data.product);
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-xl font-bold text-slate-200">Product not found</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isInCart = cartItems.some(i => i.id === product.id);

  const handleInstantBuy = () => {
    if (!isInCart) {
      addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main presentation grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Image & Description) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-blue-600/90 text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase tracking-wider text-[11px]">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white text-sm">{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              {product.summary}
            </p>
          </div>

          {/* Features Included */}
          {product.features && product.features.length > 0 && (
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>What's Included in this Download</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Documentation / Description */}
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Full Product Overview</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {product.description}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <ReviewSection
            productId={product.id}
            initialReviews={reviews}
            onReviewAdded={fetchDetails}
          />
        </div>

        {/* Right Column (Sticky Pricing & Download Specs Card) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl space-y-6">
            {/* Price section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">One-time payment • Lifetime access</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleInstantBuy}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Instant Checkout</span>
              </button>

              <button
                onClick={() => addToCart(product)}
                className={`w-full py-3 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                  isInCart
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Already in Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Asset specifications */}
            {product.fileDetails && (
              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Asset Specifications</h4>
                <div className="space-y-2 text-slate-400">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-400" />
                      Format:
                    </span>
                    <span className="font-semibold text-slate-200">{product.fileDetails.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      File Size:
                    </span>
                    <span className="font-semibold text-slate-200">{product.fileDetails.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                      Version:
                    </span>
                    <span className="font-semibold text-slate-200">{product.fileDetails.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-400" />
                      License:
                    </span>
                    <span className="font-semibold text-slate-200">{product.fileDetails.licenseType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct link generated on completion</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Encrypted Stripe checkout & verified card auth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
