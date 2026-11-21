import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ShieldCheck, Zap, DownloadCloud, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">Dev<span className="text-blue-500">Vault</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated digital downloads for developers, engineers, and designers. Ship faster with production-grade templates and architectures.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Digital Delivery • Render Ready</span>
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Catalog</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog?category=Software %26 Boilerplates" className="hover:text-white transition-colors">SaaS Boilerplates</Link></li>
              <li><Link to="/catalog?category=UI %26 Design Kits" className="hover:text-white transition-colors">Figma UI Systems</Link></li>
              <li><Link to="/catalog?category=E-Books %26 Guides" className="hover:text-white transition-colors">Architecture Handbooks</Link></li>
              <li><Link to="/catalog?category=Templates %26 Tools" className="hover:text-white transition-colors">Productivity Templates</Link></li>
            </ul>
          </div>

          {/* Customer & Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Account & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/account" className="hover:text-white transition-colors">My Download Library</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal Sign In</Link></li>
              <li><span className="text-slate-500 cursor-not-allowed">Commercial License Terms</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Stripe Secure Guarantee</span></li>
            </ul>
          </div>

          {/* Guarantee Badges */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Download Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Purchases are immediately available in your customer portal with secure download links and license tokens.
            </p>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-700/60">
              Deployable on <span className="text-blue-400 font-semibold">Render</span> with 1-click blueprint.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevVault Inc. All digital assets reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with React + Vite & Node.js</span>
            <span>•</span>
            <span>Render Cloud Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
