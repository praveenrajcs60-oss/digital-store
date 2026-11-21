import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  // Filter state
  const searchQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'featured';
  const [maxPrice, setMaxPrice] = useState(150);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || ['All']);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {
          q: searchQuery,
          category: currentCategory,
          sort: currentSort,
          maxPrice: maxPrice < 150 ? maxPrice : undefined
        };
        const data = await api.getProducts(params);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery, currentCategory, currentSort, maxPrice]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'featured') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setMaxPrice(150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header banner */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white">Digital Product Catalog</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore production codebases, design systems, and developer guides.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam('q', e.target.value)}
            placeholder="Search by title, tag, or technology..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Sort and Price controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Price range slider */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400">Max Price:</span>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 sm:w-28 accent-blue-500"
            />
            <span className="font-bold text-white">${maxPrice}</span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-800">Featured</option>
              <option value="price-low" className="bg-slate-800">Price: Low to High</option>
              <option value="price-high" className="bg-slate-800">Price: High to Low</option>
              <option value="rating" className="bg-slate-800">Highest Rated</option>
              <option value="newest" className="bg-slate-800">Newest Added</option>
            </select>
          </div>

          {/* Reset button */}
          {(searchQuery || currentCategory !== 'All' || currentSort !== 'featured' || maxPrice < 150) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{products.length}</strong> products</span>
        {searchQuery && (
          <span>
            Filtering by: "<strong className="text-blue-400">{searchQuery}</strong>"
          </span>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
          <p className="text-lg font-bold text-slate-300">No products match your criteria</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keyword, category, or price range.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
