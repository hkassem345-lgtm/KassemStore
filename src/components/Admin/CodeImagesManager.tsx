import React, { useState } from 'react';
import {
  Upload,
  Search,
  Star,
  Trash2,
  Check,
  AlertCircle,
  Images,
  ImagePlus,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../../types';

export const CodeImagesManager: React.FC = () => {
  const { products, saveProduct, settings } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Find product by selected or entered code
  const currentProduct = products.find(
    (p) =>
      p.code.trim().toLowerCase() ===
      (selectedProductCode || inputCode).trim().toLowerCase()
  );

  const handleSelectProduct = (code: string) => {
    setSelectedProductCode(code);
    setInputCode(code);
    setSuccessMessage('');
  };

  const handleUploadImagesForCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentProduct) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const newImg: ProductImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: base64,
            isPrimary: !currentProduct.images || currentProduct.images.length === 0,
          };

          const updatedImages = [...(currentProduct.images || []), newImg];
          const updatedProduct = {
            ...currentProduct,
            images: updatedImages,
            updatedAt: Date.now(),
          };

          await saveProduct(updatedProduct);
          setSuccessMessage(`تمت إضافة الصورة بنجاح للمنتج كود #${currentProduct.code}`);
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleSetPrimary = async (imgIndex: number) => {
    if (!currentProduct) return;
    const updatedImages = currentProduct.images.map((img, idx) => ({
      ...img,
      isPrimary: idx === imgIndex,
    }));

    await saveProduct({
      ...currentProduct,
      images: updatedImages,
      updatedAt: Date.now(),
    });
    setSuccessMessage('تم تعيين الصورة كأساسية');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleDeleteImage = async (imgIndex: number) => {
    if (!currentProduct) return;
    const isPrimaryRemoved = currentProduct.images[imgIndex]?.isPrimary;
    const remaining = currentProduct.images.filter((_, idx) => idx !== imgIndex);

    if (isPrimaryRemoved && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }

    await saveProduct({
      ...currentProduct,
      images: remaining,
      updatedAt: Date.now(),
    });
    setSuccessMessage('تم حذف الصورة');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-600/20">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900">
              ربط ورفع صور المنتجات بواسطة كود الصنف (Code)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed mt-1">
              ميزة مخصصة لدعم المنتجات المستوردة من Excel: أدخل كود المنتج أو اختره
              من القائمة وارفع صوره من هاتفك أو حاسوبك وحدد الصورة الأساسية.
            </p>
          </div>
        </div>

        {/* Code Selector / Search */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              أدخل كود المنتج مباشرة:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setSelectedProductCode('');
                }}
                placeholder="مثلاً: 1254 أو KS-1001"
                className="w-full text-sm p-3 pr-10 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              أو اختر من المنتجات المسجلة:
            </label>
            <select
              value={selectedProductCode}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="">-- اختر منتجاً من القائمة --</option>
              {products.map((p) => (
                <option key={p.id} value={p.code}>
                  كود #{p.code} - {p.name} ({p.images?.length || 0} صور)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Image Workspace */}
      {currentProduct ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white bg-stone-900 px-2.5 py-1 rounded-lg text-xs">
                  كود: {currentProduct.code}
                </span>
                <h3 className="font-bold text-stone-900 text-base">
                  {currentProduct.name}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                السعر: {currentProduct.price} {settings.currencySymbol} | المخزون:{' '}
                {currentProduct.stock} قطعة | عدد الصور الحالية:{' '}
                {currentProduct.images?.length || 0}
              </p>
            </div>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex-shrink-0">
              <ImagePlus className="w-4 h-4" />
              <span>رفع صور جديدة لهذا الكود</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadImagesForCode}
                className="hidden"
              />
            </label>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Current Images Grid */}
          {currentProduct.images && currentProduct.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {currentProduct.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`bg-stone-50 rounded-2xl border p-2.5 flex flex-col justify-between transition-all ${
                    img.isPrimary
                      ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Contain image (strictly uncropped) */}
                  <div className="aspect-square w-full bg-white rounded-xl p-2 flex items-center justify-center mb-2 overflow-hidden border border-stone-100">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    {img.isPrimary ? (
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded text-[11px]">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                        الأساسية
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(idx)}
                        className="text-stone-500 hover:text-amber-700 text-[11px] font-semibold hover:underline"
                      >
                        تعيين كأساسية
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteImage(idx)}
                      title="حذف الصورة"
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
              <ImagePlus className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600">
                لا توجد صور مرتبطة بهذا الكود حتى الآن.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                استخدم زر "رفع صور جديدة لهذا الكود" في الأعلى لاختيار صور من جهازك.
              </p>
            </div>
          )}
        </div>
      ) : (
        inputCode && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              لم يتم العثور على منتج يحمل الكود <strong>"{inputCode}"</strong>. يرجى
              التأكد من كتابة الكود بشكل صحيح أو إضافة المنتج أولاً.
            </span>
          </div>
        )
      )}
    </div>
  );
};
