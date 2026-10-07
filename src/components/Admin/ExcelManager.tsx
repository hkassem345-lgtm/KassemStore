import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { excelService } from '../../services/excel';
import { ExcelImportReport } from '../../types';
import { dbService } from '../../services/db';

export const ExcelManager: React.FC = () => {
  const {
    products,
    categories,
    subCategories,
    brands,
    reloadAllData,
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<ExcelImportReport | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.csv')
    ) {
      setErrorBanner('يرجى اختيار ملف بصيغة Excel (.xlsx أو .xls)');
      return;
    }

    setIsProcessing(true);
    setErrorBanner(null);
    setReport(null);

    try {
      const result = await excelService.parseAndProcessExcel(
        file,
        products,
        categories,
        subCategories,
        brands
      );

      // Save any newly auto-created categories, subcategories, or brands
      for (const cat of result.newCategories) {
        await dbService.saveCategory(cat);
      }
      for (const sub of result.newSubCategories) {
        await dbService.saveSubCategory(sub);
      }
      for (const b of result.newBrands) {
        await dbService.saveBrand(b);
      }

      // Save all updated/created products into IndexedDB
      for (const prod of result.updatedProducts) {
        await dbService.saveProduct(prod);
      }

      // Reload global StoreContext state
      await reloadAllData();

      setReport(result.report);
    } catch (err: any) {
      console.error(err);
      setErrorBanner(
        err.message || 'حدث خطأ أثناء معالجة ملف الإكسل. يرجى التأكد من أسماء الأعمدة وصحة الملف.'
      );
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    excelService.downloadTemplate();
  };

  const handleExportAll = () => {
    excelService.exportProductsToExcel(products, categories, subCategories, brands);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                إدارة واستيراد المنتجات بواسطة ملف Excel
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed mt-1">
                يمكنك رفع ملف إكسل لإضافة أصناف جديدة وتحديث الأصناف الحالية تلقائياً
                وفق كود المنتج دون فقدان صورها.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>تحميل نموذج Excel فارغ</span>
            </button>

            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>تصدير المنتجات الحالية لـ Excel</span>
            </button>
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div className="mt-6">
          <label className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
            <Upload className="w-10 h-10 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-stone-800 text-sm sm:text-base">
              {isProcessing ? 'جارٍ قراءة وتحديث المنتجات...' : 'اضغط لاختيار ملف Excel أو اسحبه إلى هنا'}
            </span>
            <span className="text-xs text-stone-500 mt-1">
              يدعم ملفات (.xlsx, .xls) مع أعمدة: الكود، الوصف، السعر، العدد، التصنيف الأساسي، التصنيف الفرعي، الماركة
            </span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="hidden"
            />
          </label>
        </div>

        {errorBanner && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}
      </div>

      {/* Post-Import Detailed Report (Requirement 12) */}
      {report && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>تقرير نتائج استيراد وتحديث ملف Excel</span>
            </h3>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              تم بنجاح
            </span>
          </div>

          {/* Report Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
              <span className="text-xs text-emerald-700 font-bold block mb-1">
                منتجات جديدة مضافة
              </span>
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {report.newCount}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl">
              <span className="text-xs text-blue-700 font-bold block mb-1">
                منتجات تم تحديثها
              </span>
              <span className="text-2xl font-black text-blue-800 font-mono">
                {report.updatedCount}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
              <span className="text-xs text-amber-700 font-bold block mb-1">
                بدون تصنيف (قيد الانتظار)
              </span>
              <span className="text-2xl font-black text-amber-800 font-mono">
                {report.pendingCategoryCount}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl">
              <span className="text-xs text-stone-600 font-bold block mb-1">
                مخزونها صفر (مخفية)
              </span>
              <span className="text-2xl font-black text-stone-800 font-mono">
                {report.zeroStockCount}
              </span>
            </div>

            <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl">
              <span className="text-xs text-red-700 font-bold block mb-1">
                أسطر بها أخطاء
              </span>
              <span className="text-2xl font-black text-red-800 font-mono">
                {report.errorsCount}
              </span>
            </div>
          </div>

          {/* Detailed rows table */}
          {report.details.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-stone-700 mb-2">
                تفاصيل العمليات المنفذة:
              </h4>
              <div className="max-h-60 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100 text-xs custom-scrollbar">
                {report.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 flex items-center justify-between hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        #{item.code}
                      </span>
                      <span className="font-medium text-stone-800 max-w-sm truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-500">{item.message}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.action === 'created'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.action === 'updated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.action === 'created'
                          ? 'إضافة جديدة'
                          : item.action === 'updated'
                          ? 'تحديث'
                          : 'خطأ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
