import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Star,
  Plus,
  AlertCircle,
  Package,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Product, ProductImage } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { categories, subCategories, brands, saveProduct, settings } = useStore();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('1');
  const [mainCategoryId, setMainCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setCode(productToEdit.code || '');
      setName(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price);
      setStock(productToEdit.stock);
      setMainCategoryId(productToEdit.mainCategoryId || '');
      setSubCategoryId(productToEdit.subCategoryId || '');
      setBrandId(productToEdit.brandId || '');
      setImages(productToEdit.images ? [...productToEdit.images] : []);
    } else {
      setCode('');
      setName('');
      setDescription('');
      setPrice('');
      setStock('1');
      setMainCategoryId('');
      setSubCategoryId('');
      setBrandId('');
      setImages([]);
    }
  }, [productToEdit]);

  // Subcategories available for chosen main category
  const filteredSubCategories = mainCategoryId
    ? subCategories.filter((s) => s.mainCategoryId === mainCategoryId)
    : [];

  // Handle uploading image files from computer or phone camera/gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('يرجى رفع ملفات صور فقط (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImages((prev) => {
            const isFirst = prev.length === 0;
            return [
              ...prev,
              {
                id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                url: base64,
                isPrimary: isFirst,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Handle adding image via web URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => {
      const isFirst = prev.length === 0;
      return [
        ...prev,
        {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          url: imageUrlInput.trim(),
          isPrimary: isFirst,
        },
      ];
    });
    setImageUrlInput('');
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const removedWasPrimary = prev[index]?.isPrimary;
      const updated = prev.filter((_, i) => i !== index);
      if (removedWasPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!code.trim()) {
      setErrorMessage('يرجى إدخال كود المنتج.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسم/وصف المنتج.');
      return;
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage('يرجى إدخال سعر صحيح للمنتج.');
      return;
    }

    const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
    if (isNaN(numStock) || numStock < 0) {
      setErrorMessage('يرجى إدخال عدد صحيح للمخزون.');
      return;
    }

    // Ensure at least one primary image if images exist
    let finalizedImages = [...images];
    if (finalizedImages.length > 0 && !finalizedImages.some((i) => i.isPrimary)) {
      finalizedImages[0].isPrimary = true;
    }

    setIsSaving(true);
    try {
      const productData: Product = {
        id: productToEdit?.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        code: code.trim(),
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        stock: numStock,
        mainCategoryId: mainCategoryId.trim(),
        subCategoryId: subCategoryId.trim(),
        brandId: brandId.trim(),
        images: finalizedImages,
        createdAt: productToEdit?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await saveProduct(productData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء حفظ المنتج.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h2>
              <p className="text-xs text-stone-500">
                أدخل تفاصيل الصنف والصور والمخزون والتصنيفات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Alert if no main category selected */}
          {!mainCategoryId && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                تنبيه: إذا لم يتم تحديد التصنيف الأساسي، سيتم وضع المنتج في حالة
                <strong> "قيد الانتظار" </strong> ولن يظهر للزبائن في المتجر حتى تحديده.
              </span>
            </div>
          )}

          {/* Row 1: Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                كود المنتج <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: 1254 أو KS-20"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم / وصف المنتج <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: طقم صحون بورسلين 24 قطعة فاخر"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Row 2: Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                السعر ({settings.currencySymbol}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 25"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                العدد / المخزون <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0 يعني نفذ من المخزون"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
              <span className="text-[11px] text-stone-500 block mt-1">
                إذا كان المخزون 0 سيتم إخفاء المنتج تلقائياً من واجهة المتجر.
              </span>
            </div>
          </div>

          {/* Row 3: Categories & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Main Category */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                التصنيف الأساسي
              </label>
              <select
                value={mainCategoryId}
                onChange={(e) => {
                  setMainCategoryId(e.target.value);
                  setSubCategoryId('');
                }}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">-- بدون تصنيف (قيد الانتظار) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                التصنيف الفرعي
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!mainCategoryId}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white disabled:bg-stone-100 disabled:text-stone-400"
              >
                <option value="">-- اختياري --</option>
                {filteredSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الماركة
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">-- بدون ماركة --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              الوصف الإضافي والمواصفات
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مواصفات المنتج، الخامة، عدد القطع، نصائح الاستخدام..."
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Image Manager Section (Requirement 2 & 13) */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-stone-700">
                صور المنتج (يمكن إضافة عدة صور، وتحديد الصورة الأساسية)
              </label>
              <span className="text-[11px] text-stone-500">
                {images.length} صور مضافة
              </span>
            </div>

            {/* Upload Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* File upload button for PC / Mobile */}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl bg-stone-50 hover:bg-amber-50/40 text-stone-700 hover:text-amber-800 transition-colors cursor-pointer text-xs font-bold">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>رفع صور من الهاتف أو الكمبيوتر</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Or Add from URL */}
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="أو الصق رابط صورة خارجي..."
                  className="flex-1 text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex-shrink-0"
                >
                  إضافة
                </button>
              </div>
            </div>

            {/* Images List */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={`relative rounded-xl border p-2 bg-white flex flex-col justify-between ${
                      img.isPrimary
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-stone-200'
                    }`}
                  >
                    {/* Uncropped preview */}
                    <div className="aspect-square w-full flex items-center justify-center p-1 bg-stone-100 rounded-lg mb-2">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Primary Badge or Set Primary */}
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      {img.isPrimary ? (
                        <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-500" />
                          الأساسية
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="text-stone-500 hover:text-amber-700 font-medium hover:underline text-[11px]"
                        >
                          تعيين كأساسية
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="حذف هذه الصورة"
                        className="text-stone-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-stone-200 rounded-2xl bg-stone-50/50 text-stone-400 text-xs">
                لا توجد صور بعد لهذا المنتج. يمكنك رفع صور الآن أو لاحقاً باستخدام كود الصنف.
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'جارٍ الحفظ...' : productToEdit ? 'تحديث المنتج' : 'إضافة المنتج للمتجر'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
