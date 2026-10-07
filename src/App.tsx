import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { StoreTopInfo } from './components/StoreTopInfo';
import { NewArrivalsSlider } from './components/NewArrivalsSlider';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { CartDrawer } from './components/CartDrawer';
import { StoreShareModal } from './components/StoreShareModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import {
  PackageOpen,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Truck,
  HeartHandshake,
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    products,
    visibleProducts,
    isLoading,
    searchQuery,
    selectedMainCategory,
    categories,
    selectedBrand,
    brands,
    isAdminOpen,
    isAdminAuthenticated,
    setActiveProductModal,
    setSearchQuery,
    setSelectedMainCategory,
    setSelectedBrand,
    settings,
  } = useStore();

  // Support direct product links from WhatsApp/Share (e.g. ?product=1254)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productCode = params.get('product');
    if (productCode && products.length > 0) {
      const match = products.find(
        (p) => p.code.toLowerCase() === productCode.toLowerCase()
      );
      if (match) {
        setActiveProductModal(match);
      }
    }
  }, [products]);

  // Current category/brand title for heading
  const currentCategoryName = categories.find(
    (c) => c.id === selectedMainCategory
  )?.name;
  const currentBrandName = brands.find((b) => b.id === selectedBrand)?.name;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full">
        {/* Store Information at the Top of the Page */}
        <StoreTopInfo />

        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">أصناف منزلية مختارة</h4>
              <p className="text-[11px] text-stone-500">أواني طهي، زجاج، بياضات ومستلزمات مطبخ</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">طلب مباشر وسريع عبر واتساب</h4>
              <p className="text-[11px] text-stone-500">اختر مشترياتك وسنجهز طلبك فوراً</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">أفضل الأسعار وأرقى الماركات</h4>
              <p className="text-[11px] text-stone-500">ضمان الجودة وأصالة الماركات العالمية</p>
            </div>
          </div>
        </div>

        {/* Section 1: "وصل حديثاً" (Requirement 1) */}
        {!searchQuery && !selectedMainCategory && !selectedBrand && (
          <NewArrivalsSlider />
        )}

        {/* Section 2: Catalog Products Grid */}
        <section className="mt-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
                <span>
                  {searchQuery
                    ? `نتائج البحث عن: "${searchQuery}"`
                    : currentCategoryName
                    ? currentCategoryName
                    : currentBrandName
                    ? `ماركة: ${currentBrandName}`
                    : 'كتالوغ المنتجات المعروضة'}
                </span>
                <span className="text-xs font-mono font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                  {visibleProducts.length} صنف
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                جميع المنتجات المعروضة متوفرة حالياً في المخزون وبكامل صورها
                ومواصفاتها.
              </p>
            </div>

            {/* Clear Filters if active */}
            {(searchQuery || selectedMainCategory || selectedBrand) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMainCategory(null);
                  setSelectedBrand(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>عرض كل الكتالوج</span>
              </button>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-stone-500 font-bold">جارٍ تحميل منتجات كاسِم ستور...</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
              <PackageOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-black text-stone-800 mb-2">
                لا توجد منتجات متطابقة
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
                لم نجد أي صنف يطابق معايير البحث أو التصفية الحالية. جرب البحث
                بكلمات أخرى أو تصفح باقي التصنيفات.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMainCategory(null);
                  setSelectedBrand(null);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                العودة لكافة المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailsModal />
      <ImageLightboxModal />
      <CartDrawer />
      <StoreShareModal />

      {/* Admin Panel Modal / Dashboard */}
      {isAdminOpen && !isAdminAuthenticated && <AdminLoginModal />}
      {isAdminOpen && isAdminAuthenticated && <AdminDashboard />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
