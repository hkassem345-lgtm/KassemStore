import React, { useState } from 'react';
import {
  Package,
  Layers,
  FileSpreadsheet,
  Images,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { ExcelManager } from './ExcelManager';
import { CodeImagesManager } from './CodeImagesManager';
import { StoreSettingsManager } from './StoreSettingsManager';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    logoutAdmin,
    setIsAdminOpen,
    pendingProducts,
    outOfStockProducts,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'excel' | 'images' | 'settings'
  >('products');

  return (
    <div className="fixed inset-0 z-50 bg-stone-100 overflow-y-auto flex flex-col">
      {/* Top Admin Navbar */}
      <nav className="bg-stone-900 text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                لوحة تحكم الإدارة
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-mono">
                  {settings.storeName}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Return to Store */}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>العودة للمتجر</span>
            </button>

            {/* Logout */}
            <button
              onClick={logoutAdmin}
              title="تسجيل الخروج"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-stone-800/80 pt-1 pb-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة المنتجات</span>
            {pendingProducts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>التصنيفات والماركات</span>
          </button>

          <button
            onClick={() => setActiveTab('excel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'excel'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>استيراد وتحديث إكسل</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'images'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>صور المنتجات بالكود</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex-shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>معلومات وإعدادات المتجر</span>
          </button>
        </div>
      </nav>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'categories' && <CategoriesManager />}
        {activeTab === 'excel' && <ExcelManager />}
        {activeTab === 'images' && <CodeImagesManager />}
        {activeTab === 'settings' && <StoreSettingsManager />}
      </main>
    </div>
  );
};
