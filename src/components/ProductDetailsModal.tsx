import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Share2,
  Maximize2,
  Check,
  ChevronRight,
  ChevronLeft,
  PackageCheck,
  MessageCircle,
  Copy,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailsModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    settings,
    categories,
    subCategories,
    brands,
    addToCart,
    sendSingleProductToWhatsApp,
    openLightbox,
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [itemNote, setItemNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setItemNote('');
    setCopied(false);
    setIsAddedToast(false);
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const brand = brands.find((b) => b.id === product.brandId);
  const mainCategory = categories.find((c) => c.id === product.mainCategoryId);
  const subCategory = subCategories.find((s) => s.id === product.subCategoryId);

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : ['https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, itemNote);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      setActiveProductModal(null);
    }, 900);
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}?product=${product.code}`;
    const shareText = `مرحباً، أريد الاستفسار عن هذا المنتج من ${settings.storeName}:\nاسم المنتج: ${product.name}\nالكود: ${product.code}\nالسعر: ${product.price}${settings.currencySymbol}\nرابط المنتج: ${productUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  const handleShareWhatsApp = () => {
    const productUrl = `${window.location.origin}?product=${product.code}`;
    const message = `مرحباً، أريد الاستفسار عن هذا المنتج من ${settings.storeName}:\nاسم المنتج: ${product.name}\nالكود: ${product.code}\nالسعر: ${product.price}${settings.currencySymbol}\nرابط المنتج: ${productUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setActiveProductModal(null)}
            className="p-2.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 shadow-md border border-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Gallery Column */}
            <div className="flex flex-col gap-3">
              {/* Main Image with guaranteed object-fit: contain */}
              <div className="relative aspect-square w-full bg-stone-100/80 rounded-2xl p-4 sm:p-6 flex items-center justify-center border border-stone-200/80 overflow-hidden group">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
                  onClick={() => openLightbox(images, selectedImageIndex)}
                />

                {/* Floating Lightbox Zoom Trigger */}
                <button
                  onClick={() => openLightbox(images, selectedImageIndex)}
                  className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold rounded-xl shadow-md border border-stone-200 transition-all"
                  title="تكبير الصورة بحجمها الكامل"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>تكبير الصورة (Zoom)</span>
                </button>

                {/* Image Counter Badge */}
                {images.length > 1 && (
                  <span className="absolute top-3 right-3 text-xs bg-black/60 text-white px-2.5 py-1 rounded-full font-mono">
                    {selectedImageIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-50 border-2 transition-all flex-shrink-0 p-1 ${
                        idx === selectedImageIndex
                          ? 'border-amber-600 ring-2 ring-amber-600/20'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Purchase Column */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Code & Categories meta */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-stone-900 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                    كود: {product.code}
                  </span>
                  {brand && (
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {brand.name}
                    </span>
                  )}
                  {mainCategory && (
                    <span className="bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {mainCategory.name}
                    </span>
                  )}
                  {subCategory && (
                    <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {subCategory.name}
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Price & Stock */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200/80 mb-4">
                  <div>
                    <span className="text-xs text-stone-500 block">السعر</span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-700 flex items-baseline gap-1">
                      <span>{product.price}</span>
                      <span className="text-sm font-bold text-stone-600">
                        {settings.currencySymbol}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <PackageCheck className="w-4 h-4" />
                      متوفر في المخزون ({product.stock} قطعة)
                    </span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      وصف المنتج والمواصفات:
                    </h4>
                    <p className="text-sm text-stone-700 leading-relaxed bg-white border border-stone-100 p-3.5 rounded-xl">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Optional Note field for item */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ملاحظة خاصة بهذا الصنف (اختياري، مثل اللون أو المقاس):
                  </label>
                  <input
                    type="text"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="مثلاً: أريد اللون الأبيض، أو طقم بغطاء ذهبي..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50"
                  />
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold text-stone-700">الكمية:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-1.5 text-stone-700 hover:bg-stone-100 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold font-mono min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="px-3.5 py-1.5 text-stone-700 hover:bg-stone-100 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-600 font-medium">
                    (أقصى كمية متاحة: {product.stock})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-base cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>
                    {isAddedToast
                      ? 'تمت الإضافة بنجاح!'
                      : `أضف إلى السلة (${product.price * quantity}${settings.currencySymbol})`}
                  </span>
                </button>

                {/* Order via WhatsApp */}
                <button
                  onClick={() => sendSingleProductToWhatsApp(product)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3 px-6 rounded-2xl shadow-xs transition-all text-sm cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>اطلب عبر WhatsApp فوراً</span>
                </button>

                {/* Share Options */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/70 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>مشاركة عبر واتساب</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>تم نسخ التفاصيل!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-stone-500" />
                        <span>مشاركة المنتج</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
