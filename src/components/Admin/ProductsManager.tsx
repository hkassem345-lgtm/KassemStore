import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductFormModal } from './ProductFormModal';

export const ProductsManager: React.FC = () => {
  const {
    products,
    categories,
    subCategories,
    brands,
    settings,
    deleteProduct,
    quickUpdateStock,
    quickUpdatePrice,
    pendingProducts,
    outOfStockProducts,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'out_of_stock'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Quick edit state for inline inputs
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<number>(0);

  const categoriesMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );
  const subCategoriesMap = useMemo(
    () => new Map(subCategories.map((s) => [s.id, s.name])),
    [subCategories]
  );
  const brandsMap = useMemo(
    () => new Map(brands.map((b) => [b.id, b.name])),
    [brands]
  );

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchCode = p.code?.toLowerCase().includes(q);
        const matchName = p.name?.toLowerCase().includes(q);
        const matchBrand = p.brandId ? brandsMap.get(p.brandId)?.toLowerCase().includes(q) : false;
        if (!matchCode && !matchName && !matchBrand) return false;
      }

      // Category
      if (filterCategory !== 'all' && p.mainCategoryId !== filterCategory) {
        return false;
      }

      // Brand
      if (filterBrand !== 'all' && p.brandId !== filterBrand) {
        return false;
      }

      // Status
      if (filterStatus === 'pending') {
        return !p.mainCategoryId || p.mainCategoryId.trim() === '';
      }
      if (filterStatus === 'out_of_stock') {
        return p.stock <= 0;
      }
      if (filterStatus === 'active') {
        return p.stock > 0 && Boolean(p.mainCategoryId);
      }

      return true;
    });
  }, [products, search, filterCategory, filterBrand, filterStatus, brandsMap]);

  const handleEdit = (p: Product) => {
    setProductToEdit(p);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleSaveQuickStock = async (id: string) => {
    await quickUpdateStock(id, tempStockValue);
    setEditingStockId(null);
  };

  const handleSaveQuickPrice = async (id: string) => {
    await quickUpdatePrice(id, tempPriceValue);
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500 font-medium block mb-1">
            إجمالي الأصناف
          </span>
          <span className="text-2xl font-black text-stone-900 font-mono">
            {products.length}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus('active')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'active'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-xs text-emerald-700 font-bold block mb-1">
            نشط في المتجر (مخزون &gt; 0)
          </span>
          <span className="text-2xl font-black text-emerald-800 font-mono">
            {products.filter((p) => p.stock > 0 && p.mainCategoryId).length}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-amber-700 font-bold block">
              قيد الانتظار (بدون تصنيف)
            </span>
            {pendingProducts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="text-2xl font-black text-amber-800 font-mono">
            {pendingProducts.length}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus('out_of_stock')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'out_of_stock'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500/20'
              : 'bg-white border-stone-200 hover:border-red-300'
          }`}
        >
          <span className="text-xs text-red-700 font-bold block mb-1">
            نفذ من المخزون (مخفي)
          </span>
          <span className="text-2xl font-black text-red-800 font-mono">
            {outOfStockProducts.length}
          </span>
        </div>
      </div>

      {/* Action Bar: Add Product & Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Add product button */}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صنف جديد</span>
          </button>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالكود، الاسم، أو الماركة..."
              className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-600 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            تصفية النتائج:
          </span>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط بالمتجر</option>
            <option value="pending">قيد الانتظار (يحتاج لتصنيف)</option>
            <option value="out_of_stock">نفذ من المخزون (0)</option>
          </select>

          {/* Main Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium"
          >
            <option value="all">جميع الماركات</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {(search || filterCategory !== 'all' || filterBrand !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setFilterCategory('all');
                setFilterBrand('all');
                setFilterStatus('all');
              }}
              className="text-red-600 hover:underline mr-auto text-xs font-semibold"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-stone-100/80 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">الصورة</th>
                <th className="py-3 px-4">الكود</th>
                <th className="py-3 px-4">اسم المنتج</th>
                <th className="py-3 px-4">التصنيف الأساسي</th>
                <th className="py-3 px-4">الماركة</th>
                <th className="py-3 px-4">السعر ({settings.currencySymbol})</th>
                <th className="py-3 px-4">المخزون</th>
                <th className="py-3 px-4">الحالة في المتجر</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    لا توجد منتجات مطابقة لخيارات البحث الحالية.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const primaryImg =
                    p.images?.find((img) => img.isPrimary)?.url ||
                    p.images?.[0]?.url ||
                    '';

                  const hasCategory = Boolean(p.mainCategoryId);
                  const isAvailable = p.stock > 0;
                  const isVisibleInStore = hasCategory && isAvailable;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-stone-50/80 transition-colors group"
                    >
                      {/* Thumbnail (contain, uncropped) */}
                      <td className="py-2.5 px-4">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 p-1 flex items-center justify-center overflow-hidden">
                          {primaryImg ? (
                            <img
                              src={primaryImg}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-2.5 px-4 font-mono font-bold text-stone-900">
                        #{p.code}
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-4 max-w-xs">
                        <span className="font-semibold text-stone-900 line-clamp-2">
                          {p.name}
                        </span>
                        {p.subCategoryId && (
                          <span className="text-[11px] text-stone-600 block">
                            {subCategoriesMap.get(p.subCategoryId)}
                          </span>
                        )}
                      </td>

                      {/* Main Category */}
                      <td className="py-2.5 px-4">
                        {p.mainCategoryId ? (
                          <span className="text-stone-700 font-medium">
                            {categoriesMap.get(p.mainCategoryId)}
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold inline-block">
                            يحتاج تصنيف أساسي
                          </span>
                        )}
                      </td>

                      {/* Brand */}
                      <td className="py-2.5 px-4 text-stone-600">
                        {p.brandId ? brandsMap.get(p.brandId) || '-' : '-'}
                      </td>

                      {/* Quick Edit Price */}
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-800">
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={tempPriceValue}
                              onChange={(e) =>
                                setTempPriceValue(parseFloat(e.target.value) || 0)
                              }
                              className="w-16 p-1 border border-amber-500 rounded text-xs bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveQuickPrice(p.id)}
                              className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-xs font-bold"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="text-stone-400 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setTempPriceValue(p.price);
                            }}
                            title="انقر لتعديل السعر السريع"
                            className="cursor-pointer hover:underline hover:text-amber-600"
                          >
                            {p.price} {settings.currencySymbol}
                          </span>
                        )}
                      </td>

                      {/* Quick Edit Stock */}
                      <td className="py-2.5 px-4 font-mono font-bold">
                        {editingStockId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={tempStockValue}
                              onChange={(e) =>
                                setTempStockValue(parseInt(e.target.value, 10) || 0)
                              }
                              className="w-14 p-1 border border-amber-500 rounded text-xs bg-white"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveQuickStock(p.id)}
                              className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-xs font-bold"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="text-stone-400 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingStockId(p.id);
                              setTempStockValue(p.stock);
                            }}
                            title="انقر لتعديل المخزون مباشرة"
                            className={`cursor-pointer hover:underline px-2 py-0.5 rounded text-xs ${
                              p.stock > 0
                                ? 'text-stone-800 hover:text-amber-600'
                                : 'text-red-700 bg-red-50'
                            }`}
                          >
                            {p.stock} قطعة
                          </span>
                        )}
                      </td>

                      {/* Store Visibility Status Rule */}
                      <td className="py-2.5 px-4">
                        {isVisibleInStore ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            معروض بالمتجر
                          </span>
                        ) : !hasCategory ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            قيد الانتظار (مخفي)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            مخزون 0 (مخفي)
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(p)}
                            title="تعديل المنتج"
                            className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {deleteConfirmId === p.id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="text-red-600 font-bold text-xs hover:underline px-1"
                              >
                                تأكيد الحذف
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-stone-400 text-xs px-1"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              title="حذف المنتج"
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductFormModal
          productToEdit={productToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setProductToEdit(null);
          }}
        />
      )}
    </div>
  );
};
