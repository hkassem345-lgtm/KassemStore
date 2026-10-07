import React, { useRef } from 'react';
import {
  Search,
  X,
  ShoppingBag,
  Share2,
  PhoneCall,
  SlidersHorizontal,
  Sparkles,
  UtensilsCrossed,
  Filter,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    settings,
    categories,
    subCategories,
    brands,
    cartItemCount,
    setIsCartOpen,
    setIsShareStoreOpen,
    searchQuery,
    setSearchQuery,
    selectedMainCategory,
    setSelectedMainCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedBrand,
    setSelectedBrand,
    priceSort,
    setPriceSort,
    visibleProducts,
  } = useStore();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Available subcategories for the selected main category
  const activeSubCategories = selectedMainCategory
    ? subCategories.filter((s) => s.mainCategoryId === selectedMainCategory)
    : [];

  const handleClearFilters = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedBrand(null);
    setSearchQuery('');
    setPriceSort('default');
  };

  const hasActiveFilters =
    Boolean(selectedMainCategory) ||
    Boolean(selectedSubCategory) ||
    Boolean(selectedBrand) ||
    Boolean(searchQuery.trim()) ||
    priceSort !== 'default';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      {/* Top Bar: Contact info & quick phone */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-amber-400">Kassem Store</span>
            <span className="text-stone-400 hidden sm:inline">|</span>
            <span className="text-stone-400 text-[11px] hidden sm:inline">
              {settings.address}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <span className="hidden xs:inline">واتساب:</span>
              <span dir="ltr">{settings.whatsappNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Store Brand */}
          <div
            onClick={handleClearFilters}
            className="flex items-center gap-3 cursor-pointer select-none group flex-shrink-0"
          >
            {settings.logoUrl ? (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
                  كاسِم ستور
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-700 font-mono tracking-wider">
                  Kassem
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium hidden sm:block">
                {settings.storeSubtitle || 'أدوات منزلية ومستلزمات مطبخ راقية'}
              </p>
            </div>
          </div>

          {/* Search Input Bar (Desktop & Tablet) */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، كود الصنف، الماركة، أو الوصف..."
                className="w-full pl-10 pr-11 py-2.5 bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 rounded-2xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-500 absolute right-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: Share & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Share Store Button */}
            <button
              onClick={() => setIsShareStoreOpen(true)}
              title="مشاركة المتجر"
              className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">مشاركة المتجر</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">السلة</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-amber-800 text-xs font-black flex items-center justify-center font-mono">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        <div className="mt-3 relative block md:hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، كود الصنف، الماركة..."
            className="w-full pl-9 pr-10 py-2.5 bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-300 focus:border-amber-600 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <Search className="w-4 h-4 text-stone-500 absolute right-3 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Main Categories Horizontal Scroll Bar */}
        <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* 'All' button */}
          <button
            onClick={() => {
              setSelectedMainCategory(null);
              setSelectedSubCategory(null);
            }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedMainCategory === null
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            جميع الأصناف
          </button>

          {/* List of Main Categories */}
          {categories.map((cat) => {
            const isSelected = selectedMainCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedMainCategory(isSelected ? null : cat.id);
                  setSelectedSubCategory(null);
                }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Secondary Subcategory & Filter Row */}
        {(activeSubCategories.length > 0 || brands.length > 0 || hasActiveFilters) && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dashed border-stone-200 text-xs">
            {/* Subcategories (if selected) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-1">
              {activeSubCategories.length > 0 && (
                <>
                  <span className="text-stone-700 font-bold ml-1 flex-shrink-0">
                    التصنيف الفرعي:
                  </span>
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                      selectedSubCategory === null
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    الكل
                  </button>
                  {activeSubCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() =>
                        setSelectedSubCategory(
                          selectedSubCategory === sub.id ? null : sub.id
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                        selectedSubCategory === sub.id
                          ? 'bg-amber-700 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Filter controls: Brand & Sort */}
            <div className="flex items-center gap-2 flex-shrink-0 mr-auto">
              {/* Brand Selector */}
              {brands.length > 0 && (
                <select
                  value={selectedBrand || ''}
                  onChange={(e) => setSelectedBrand(e.target.value || null)}
                  className="bg-stone-100 border border-stone-200 text-stone-700 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">جميع الماركات</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Price Sort Selector */}
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="bg-stone-100 border border-stone-200 text-stone-700 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="newest">وصل حديثاً (الأحدث)</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
              </select>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-red-700 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  إلغاء التصفية
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
