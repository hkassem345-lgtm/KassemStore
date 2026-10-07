export interface ProductImage {
  id: string;
  url: string; // Base64 data url or external url
  isPrimary: boolean;
}

export interface Product {
  id: string;
  code: string; // e.g. "KS-1001" or "1254"
  name: string; // اسم/وصف المنتج
  description?: string;
  price: number;
  stock: number;
  mainCategoryId?: string; // If undefined or empty, stays in "Pending"
  subCategoryId?: string;
  brandId?: string;
  images: ProductImage[];
  createdAt: number;
  updatedAt: number;
}

export interface MainCategory {
  id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface SubCategory {
  id: string;
  name: string;
  mainCategoryId: string;
}

export interface Brand {
  id: string;
  name: string;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note: string; // ملاحظة خاصة لكل صنف
}

export interface StoreSettings {
  storeName: string;
  storeSubtitle: string;
  storeDescription: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumber: string; // e.g. "96170123456"
  phoneNumbers: string[];
  address: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  whatsappOrderIntro: string;
  adminPasswordHash: string; // Default or custom password
  currencySymbol: string;
}

export interface ExcelImportReport {
  newCount: number;
  updatedCount: number;
  errorsCount: number;
  pendingCategoryCount: number;
  zeroStockCount: number;
  details: {
    code: string;
    name: string;
    action: 'created' | 'updated' | 'error';
    message: string;
  }[];
}
