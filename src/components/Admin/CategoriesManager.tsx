import React, { useState } from 'react';
import {
  Layers,
  FolderTree,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MainCategory, SubCategory, Brand } from '../../types';

export const CategoriesManager: React.FC = () => {
  const {
    categories,
    subCategories,
    brands,
    saveCategory,
    deleteCategory,
    saveSubCategory,
    deleteSubCategory,
    saveBrand,
    deleteBrand,
  } = useStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'main' | 'sub' | 'brands'>('main');

  // Main Category Form State
  const [editingMainCat, setEditingMainCat] = useState<MainCategory | null>(null);
  const [mainCatName, setMainCatName] = useState('');

  // Sub Category Form State
  const [editingSubCat, setEditingSubCat] = useState<SubCategory | null>(null);
  const [subCatName, setSubCatName] = useState('');
  const [subCatParentId, setSubCatParentId] = useState('');

  // Brand Form State
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');

  // Main Category Handlers
  const handleSaveMainCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainCatName.trim()) return;

    const cat: MainCategory = {
      id: editingMainCat?.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: mainCatName.trim(),
      order: editingMainCat?.order || categories.length + 1,
    };

    await saveCategory(cat);
    setMainCatName('');
    setEditingMainCat(null);
  };

  const startEditMain = (cat: MainCategory) => {
    setEditingMainCat(cat);
    setMainCatName(cat.name);
  };

  // Sub Category Handlers
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCatName.trim() || !subCatParentId) return;

    const sub: SubCategory = {
      id: editingSubCat?.id || `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: subCatName.trim(),
      mainCategoryId: subCatParentId,
    };

    await saveSubCategory(sub);
    setSubCatName('');
    setSubCatParentId(categories[0]?.id || '');
    setEditingSubCat(null);
  };

  const startEditSub = (sub: SubCategory) => {
    setEditingSubCat(sub);
    setSubCatName(sub.name);
    setSubCatParentId(sub.mainCategoryId);
  };

  // Brand Handlers
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    const b: Brand = {
      id: editingBrand?.id || `brand-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: brandName.trim(),
      order: editingBrand?.order || brands.length + 1,
    };

    await saveBrand(b);
    setBrandName('');
    setEditingBrand(null);
  };

  const startEditBrand = (b: Brand) => {
    setEditingBrand(b);
    setBrandName(b.name);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'main'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>التصنيفات الأساسية ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sub')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'sub'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>التصنيفات الفرعية ({subCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'brands'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>الماركات ({brands.length})</span>
        </button>
      </div>

      {/* 1. Main Categories Tab */}
      {activeTab === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add / Edit Form */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="font-black text-stone-900 text-sm mb-3">
              {editingMainCat ? 'تعديل التصنيف الأساسي' : 'إضافة تصنيف أساسي جديد'}
            </h3>
            <form onSubmit={handleSaveMainCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اسم التصنيف الأساسي
                </label>
                <input
                  type="text"
                  value={mainCatName}
                  onChange={(e) => setMainCatName(e.target.value)}
                  placeholder="مثال: أدوات المطبخ، الزجاج..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-colors"
                >
                  {editingMainCat ? 'حفظ التعديل' : 'إضافة التصنيف'}
                </button>
                {editingMainCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMainCat(null);
                      setMainCatName('');
                    }}
                    className="p-2 border border-stone-300 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Main Categories */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-700">
              قائمة التصنيفات الأساسية الحالية
            </div>
            <div className="divide-y divide-stone-100">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-600 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditMain(cat)}
                      className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `هل أنت متأكد من حذف تصنيف "${cat.name}"؟ أي منتج مرتبط به سينتقل إلى حالة قيد الانتظار.`
                          )
                        ) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Sub Categories Tab */}
      {activeTab === 'sub' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add / Edit Form */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="font-black text-stone-900 text-sm mb-3">
              {editingSubCat ? 'تعديل التصنيف الفرعي' : 'إضافة تصنيف فرعي جديد'}
            </h3>
            <form onSubmit={handleSaveSubCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ربط بالتصنيف الأساسي
                </label>
                <select
                  value={subCatParentId}
                  onChange={(e) => setSubCatParentId(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  required
                >
                  <option value="">اختر التصنيف الأساسي...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اسم التصنيف الفرعي
                </label>
                <input
                  type="text"
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                  placeholder="مثال: صحون، أباريق، مقالي..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-colors"
                >
                  {editingSubCat ? 'حفظ التعديل' : 'إضافة التصنيف الفرعي'}
                </button>
                {editingSubCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubCat(null);
                      setSubCatName('');
                    }}
                    className="p-2 border border-stone-300 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Sub Categories */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-700">
              قائمة التصنيفات الفرعية وربطها بالتصنيف الأساسي
            </div>
            <div className="divide-y divide-stone-100">
              {subCategories.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  لا توجد تصنيفات فرعية مضافة بعد.
                </div>
              ) : (
                subCategories.map((sub) => {
                  const parent = categories.find((c) => c.id === sub.mainCategoryId);
                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-stone-900 text-sm block">
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          التصنيف الأساسي: {parent?.name || 'غير محدد'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditSub(sub)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف تصنيف "${sub.name}"؟`)) {
                              deleteSubCategory(sub.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Brands Tab */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add / Edit Form */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <h3 className="font-black text-stone-900 text-sm mb-3">
              {editingBrand ? 'تعديل الماركة' : 'إضافة ماركة جديدة'}
            </h3>
            <form onSubmit={handleSaveBrand} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  اسم الماركة التجارية
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="مثال: Tefal, Korkmaz..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs transition-colors"
                >
                  {editingBrand ? 'حفظ التعديل' : 'إضافة الماركة'}
                </button>
                {editingBrand && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBrand(null);
                      setBrandName('');
                    }}
                    className="p-2 border border-stone-300 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-semibold"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Brands */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-700">
              قائمة الماركات المسجلة في المتجر
            </div>
            <div className="divide-y divide-stone-100">
              {brands.map((b, idx) => (
                <div
                  key={b.id}
                  className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-600 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{b.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditBrand(b)}
                      className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف ماركة "${b.name}"؟`)) {
                          deleteBrand(b.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
