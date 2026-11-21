import React from 'react';
import { Link } from 'react-router-dom';
import { Star, DownloadCloud, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some(item => item.id === product.id);

  const badgeColor = {
    'Best Seller': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Popular': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Staff Pick': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'New': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }[product.badge] || 'bg-slate-700 text-slate-300 border-slate-600';

  return (
    <div className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/products/${product.slug || product.id}`} className="block relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badgeColor}`}>
            {product.badge}
          </span>
        )}

        {/* Format Pill */}
        {product.fileDetails && (
          <span className="absolute bottom-3 right-3 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-md">
            {product.fileDetails.format}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="text-blue-400 font-medium tracking-wide uppercase text-[10px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-200">{product.rating}</span>
            <span className="text-slate-500">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-2 text-base">
            {product.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.summary}
        </p>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              isInCart
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
