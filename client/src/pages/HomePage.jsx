import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCode,
  BookOpen,
  Layout
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProducts({ sort: 'featured' });
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Software & Boilerplates', icon: FileCode, count: 'Production Starters', color: 'from-blue-600 to-indigo-600' },
    { name: 'UI & Design Kits', icon: Layout, count: 'Figma & Design Tokens', color: 'from-purple-600 to-pink-600' },
    { name: 'E-Books & Guides', icon: BookOpen, count: 'Architecture & DevOps', color: 'from-emerald-600 to-teal-600' },
    { name: 'Templates & Tools', icon: Layers, count: 'Workspaces & Notion', color: 'from-amber-600 to-orange-600' }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="w-[400px] h-[250px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Assets Store Built with React + Vite & Node</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Production-ready assets for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              modern builders
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instant digital access to tested SaaS boilerplates, design systems, and system architecture guides. Skip months of setup and launch today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/catalog"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore All Downloads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog?category=Software %26 Boilerplates"
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition-all"
            >
              SaaS Starters
            </Link>
          </div>

          {/* Trust Value Props */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <DownloadCloud className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Instant Delivery</h4>
                <p className="text-[11px] text-slate-400">Direct download link on checkout</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Stripe Verified</h4>
                <p className="text-[11px] text-slate-400">Safe 256-bit card processing</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Commercial Rights</h4>
                <p className="text-[11px] text-slate-400">Build unlimited client apps</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-white">Free Updates</h4>
                <p className="text-[11px] text-slate-400">Lifetime access in your portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Browse Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Select an asset type to jumpstart your project</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group relative p-6 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors text-sm">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400">{cat.count}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Featured Digital Assets</h2>
            <p className="text-xs text-slate-400 mt-1">High-impact boilerplates, design systems, and guides</p>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
