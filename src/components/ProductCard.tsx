import React from 'react';
import { ShoppingBag, Eye, Maximize2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    settings,
    brands,
    categories,
    addToCart,
    setActiveProductModal,
    openLightbox,
  } = useStore();

  const brand = brands.find((b) => b.id === product.brandId);
  const category = categories.find((c) => c.id === product.mainCategoryId);

  // Find primary image or first available
  const primaryImg =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=600&q=80';

  const allImages =
    product.images.length > 0
      ? product.images.map((img) => img.url)
      : [primaryImg];

  const handleCardClick = () => {
    setActiveProductModal(product);
  };

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openLightbox(allImages, 0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-amber-400/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Code Badge */}
        <span className="bg-stone-900/80 text-white backdrop-blur-xs text-xs font-mono font-semibold px-2.5 py-1 rounded-md shadow-xs">
          كود: {product.code}
        </span>

        {/* Brand or Multi-images indicator */}
        <div className="flex items-center gap-1.5">
          {product.images.length > 1 && (
            <span className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-stone-300/80">
              {product.images.length} صور
            </span>
          )}
          {brand && (
            <span className="bg-amber-100/90 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
              {brand.name}
            </span>
          )}
        </div>
      </div>

      {/* Image Container with STRICT object-fit: contain (no cropping!) */}
      <div className="relative w-full aspect-square bg-stone-50/80 p-5 flex items-center justify-center overflow-hidden border-b border-stone-100">
        <img
          src={primaryImg}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Zoom Action */}
        <button
          onClick={handleZoomClick}
          title="تكبير ومعاينة الصورة كاملة"
          className="absolute bottom-3 left-3 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-amber-600 rounded-lg shadow-md border border-stone-200 transition-all opacity-85 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {category && (
            <span className="text-xs text-stone-700 font-medium block mb-1">
              {category.name}
            </span>
          )}
          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-700 block">السعر</span>
            <div className="flex items-baseline gap-1 text-amber-700 font-black text-lg sm:text-xl">
              <span>{product.price}</span>
              <span className="text-sm font-bold text-stone-600">{settings.currencySymbol}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              title="إضافة إلى السلة"
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
