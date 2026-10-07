import * as XLSX from 'xlsx';
import { Product, MainCategory, SubCategory, Brand, ExcelImportReport } from '../types';

export interface RawExcelRow {
  [key: string]: any;
}

export const excelService = {
  // Parse uploaded Excel file and import/update products
  async parseAndProcessExcel(
    file: File,
    currentProducts: Product[],
    categories: MainCategory[],
    subCategories: SubCategory[],
    brands: Brand[]
  ): Promise<{
    updatedProducts: Product[];
    report: ExcelImportReport;
    newCategories: MainCategory[];
    newSubCategories: SubCategory[];
    newBrands: Brand[];
  }> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<RawExcelRow>(worksheet, { defval: '' });

    const productsMap = new Map<string, Product>();
    // Index current products by code (trimmed, uppercase for consistency)
    currentProducts.forEach((p) => {
      productsMap.set(p.code.trim().toUpperCase(), { ...p });
    });

    const categoryMapByName = new Map<string, MainCategory>();
    categories.forEach((c) => categoryMapByName.set(c.name.trim().toLowerCase(), c));

    const subCategoryMapByName = new Map<string, SubCategory>();
    subCategories.forEach((s) => subCategoryMapByName.set(s.name.trim().toLowerCase(), s));

    const brandMapByName = new Map<string, Brand>();
    brands.forEach((b) => brandMapByName.set(b.name.trim().toLowerCase(), b));

    const newCategories: MainCategory[] = [];
    const newSubCategories: SubCategory[] = [];
    const newBrands: Brand[] = [];

    const report: ExcelImportReport = {
      newCount: 0,
      updatedCount: 0,
      errorsCount: 0,
      pendingCategoryCount: 0,
      zeroStockCount: 0,
      details: [],
    };

    // Helper to find column value by matching possible header names
    const getColVal = (row: RawExcelRow, possibleNames: string[]): string => {
      for (const name of possibleNames) {
        for (const key of Object.keys(row)) {
          if (key.trim().toLowerCase() === name.trim().toLowerCase()) {
            return String(row[key] ?? '').trim();
          }
        }
      }
      return '';
    };

    rawRows.forEach((row, index) => {
      const rowNum = index + 2; // considering 1st row is header
      const code = getColVal(row, ['الكود', 'كود', 'كود المنتج', 'code', 'product_code', 'id']);
      const name = getColVal(row, ['الوصف', 'اسم المنتج', 'الاسم', 'اسم/وصف المنتج', 'name', 'description']);
      const priceRaw = getColVal(row, ['السعر', 'سعر', 'price']);
      const stockRaw = getColVal(row, ['العدد', 'المخزون', 'الكمية', 'stock', 'qty', 'quantity']);
      const mainCatName = getColVal(row, ['التصنيف الأساسي', 'التصنيف الرئيسي', 'تصنيف أساسي', 'category', 'main category']);
      const subCatName = getColVal(row, ['التصنيف الفرعي', 'تصنيف فرعي', 'sub category', 'subcategory']);
      const brandName = getColVal(row, ['الماركة', 'ماركة', 'براند', 'brand']);

      if (!code) {
        report.errorsCount++;
        report.details.push({
          code: `سطر ${rowNum}`,
          name: name || 'بدون اسم',
          action: 'error',
          message: 'كود المنتج مفقود أو فارغ',
        });
        return;
      }

      if (!name) {
        report.errorsCount++;
        report.details.push({
          code,
          name: 'غير محدد',
          action: 'error',
          message: 'اسم/وصف المنتج مفقود',
        });
        return;
      }

      const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;
      const stock = parseInt(stockRaw.replace(/[^0-9-]/g, ''), 10) || 0;

      // Resolve or auto-register Main Category
      let mainCategoryId = '';
      if (mainCatName) {
        const catKey = mainCatName.toLowerCase();
        let cat = categoryMapByName.get(catKey);
        if (!cat) {
          cat = {
            id: `cat-auto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: mainCatName,
            order: categories.length + newCategories.length + 1,
          };
          categoryMapByName.set(catKey, cat);
          newCategories.push(cat);
        }
        mainCategoryId = cat.id;
      }

      // Resolve or auto-register Brand
      let brandId = '';
      if (brandName) {
        const brandKey = brandName.toLowerCase();
        let b = brandMapByName.get(brandKey);
        if (!b) {
          b = {
            id: `brand-auto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: brandName,
            order: brands.length + newBrands.length + 1,
          };
          brandMapByName.set(brandKey, b);
          newBrands.push(b);
        }
        brandId = b.id;
      }

      // Resolve or auto-register SubCategory
      let subCategoryId = '';
      if (subCatName && mainCategoryId) {
        const subKey = subCatName.toLowerCase();
        let sub = subCategoryMapByName.get(subKey);
        if (!sub) {
          sub = {
            id: `sub-auto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: subCatName,
            mainCategoryId,
          };
          subCategoryMapByName.set(subKey, sub);
          newSubCategories.push(sub);
        }
        subCategoryId = sub.id;
      }

      // Statistics flags
      if (!mainCategoryId) {
        report.pendingCategoryCount++;
      }
      if (stock === 0) {
        report.zeroStockCount++;
      }

      const normalizedKey = code.toUpperCase();
      const existing = productsMap.get(normalizedKey);

      if (existing) {
        // Update product
        const updated: Product = {
          ...existing,
          name,
          price,
          stock,
          mainCategoryId: mainCategoryId || existing.mainCategoryId || '',
          subCategoryId: subCategoryId || existing.subCategoryId || '',
          brandId: brandId || existing.brandId || '',
          updatedAt: Date.now(),
        };
        productsMap.set(normalizedKey, updated);
        report.updatedCount++;
        report.details.push({
          code,
          name,
          action: 'updated',
          message: 'تم تحديث بيانات المنتج بنجاح',
        });
      } else {
        // Create new product
        const newProduct: Product = {
          id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          code,
          name,
          price,
          stock,
          mainCategoryId,
          subCategoryId,
          brandId,
          images: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        productsMap.set(normalizedKey, newProduct);
        report.newCount++;
        report.details.push({
          code,
          name,
          action: 'created',
          message: 'تمت إضافة منتج جديد بنجاح',
        });
      }
    });

    return {
      updatedProducts: Array.from(productsMap.values()),
      report,
      newCategories,
      newSubCategories,
      newBrands,
    };
  },

  // Export all products to Excel
  exportProductsToExcel(
    products: Product[],
    categories: MainCategory[],
    subCategories: SubCategory[],
    brands: Brand[]
  ) {
    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const subMap = new Map(subCategories.map((s) => [s.id, s.name]));
    const brandMap = new Map(brands.map((b) => [b.id, b.name]));

    const rows = products.map((p) => ({
      'الكود': p.code,
      'الوصف': p.name,
      'السعر': p.price,
      'العدد': p.stock,
      'التصنيف الأساسي': p.mainCategoryId ? catMap.get(p.mainCategoryId) || '' : '',
      'التصنيف الفرعي': p.subCategoryId ? subMap.get(p.subCategoryId) || '' : '',
      'الماركة': p.brandId ? brandMap.get(p.brandId) || '' : '',
      'عدد الصور': p.images?.length || 0,
      'الحالة': !p.mainCategoryId
        ? 'قيد الانتظار (بدون تصنيف أساسي)'
        : p.stock === 0
        ? 'نفذ من المخزون (مخفي)'
        : 'نشط في المتجر',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');

    XLSX.writeFile(workbook, `Kassem_Store_Products_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  // Download a clean blank template for the merchant
  downloadTemplate() {
    const sampleData = [
      {
        'الكود': '1001',
        'الوصف': 'طقم طناجر غرانيت 9 قطع غطاء زجاجي',
        'السعر': 85,
        'العدد': 10,
        'التصنيف الأساسي': 'أدوات المطبخ والطهي',
        'التصنيف الفرعي': 'طناجر وقدور طهي',
        'الماركة': 'Korkmaz',
      },
      {
        'الكود': '1002',
        'الوصف': 'طقم فناجين قهوة بورسلين 12 قطعة',
        'السعر': 20,
        'العدد': 15,
        'التصنيف الأساسي': 'مستلزمات القهوة والشاي',
        'التصنيف الفرعي': 'أكواب وفناجين شاي وقهوة',
        'الماركة': 'Kassem Home',
      },
      {
        'الكود': '1003',
        'الوصف': 'علب تخزين طعام زجاجية طقم 3 قطع',
        'السعر': 14,
        'العدد': 25,
        'التصنيف الأساسي': 'البلاستيك وحافظات الطعام',
        'التصنيف الفرعي': 'حافظات طعام ومطربانات',
        'الماركة': 'Luminarc',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'نموذج_إضافة_منتجات');
    XLSX.writeFile(workbook, 'Kassem_Store_Products_Template.xlsx');
  },
};
