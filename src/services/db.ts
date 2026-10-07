import { Product, MainCategory, SubCategory, Brand, StoreSettings } from '../types';

const DB_NAME = 'KassemStoreDB';
const DB_VERSION = 1;

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Kassem Store | كاسِم ستور',
  storeSubtitle: 'عالم الأدوات المنزلية ومستلزمات المطبخ الفاخرة',
  storeDescription: 'متجر كاسِم ستور يقدم لكم أجود أنواع أواني الطهي، أطقم التقديم، مستلزمات المطبخ الحديثة وأرقى الماركات العالمية بأسعار تنافسية.',
  logoUrl: '',
  bannerUrl: '',
  whatsappNumber: '96170123456',
  phoneNumbers: ['+961 70 123 456', '+961 01 234 567'],
  address: 'بيروت - أوتوستراد السيد هادي / فرع الأدوات المنزلية',
  workingHours: 'يومياً من الساعة 9:00 صباحاً حتى 9:00 مساءً (الجمعة بعد الظهر عطلة)',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
  whatsappOrderIntro: 'طلب جديد من كاسِم ستور:',
  adminPasswordHash: 'kassem123', // Default admin password
  currencySymbol: '$',
};

const INITIAL_CATEGORIES: MainCategory[] = [
  { id: 'cat-kitchen', name: 'أدوات المطبخ والطهي', order: 1 },
  { id: 'cat-glass', name: 'الزجاج والبورسلين', order: 2 },
  { id: 'cat-tableware', name: 'أدوات المائدة والتقديم', order: 3 },
  { id: 'cat-plastic', name: 'البلاستيك وحافظات الطعام', order: 4 },
  { id: 'cat-cleaning', name: 'أدوات التنظيف والتنظيم', order: 5 },
  { id: 'cat-appliances', name: 'مستلزمات القهوة والشاي', order: 6 },
];

const INITIAL_SUB_CATEGORIES: SubCategory[] = [
  { id: 'sub-cookware', name: 'طناجر وقدور طهي', mainCategoryId: 'cat-kitchen' },
  { id: 'sub-pans', name: 'مقالي وصواني فرن', mainCategoryId: 'cat-kitchen' },
  { id: 'sub-utensils', name: 'ملاعق وسكاكين طهي', mainCategoryId: 'cat-kitchen' },
  { id: 'sub-dinnerware', name: 'أطقم صحون وسفريات', mainCategoryId: 'cat-glass' },
  { id: 'sub-cups', name: 'أكواب وفناجين شاي وقهوة', mainCategoryId: 'cat-glass' },
  { id: 'sub-cutlery', name: 'أطقم ملاعق وشوك ستانلس', mainCategoryId: 'cat-tableware' },
  { id: 'sub-trays', name: 'صواني تقديم وضيافة', mainCategoryId: 'cat-tableware' },
  { id: 'sub-containers', name: 'حافظات طعام ومطربانات', mainCategoryId: 'cat-plastic' },
  { id: 'sub-organizers', name: 'منظمات دواليب وأدراج', mainCategoryId: 'cat-cleaning' },
  { id: 'sub-teapots', name: 'أباريق وترامس حرارية', mainCategoryId: 'cat-appliances' },
];

const INITIAL_BRANDS: Brand[] = [
  { id: 'brand-korkmaz', name: 'Korkmaz (كوركماز)', order: 1 },
  { id: 'brand-tefal', name: 'Tefal (تيفال)', order: 2 },
  { id: 'brand-luminarc', name: 'Luminarc (لومينارك)', order: 3 },
  { id: 'brand-neoflam', name: 'Neoflam (نيوفلام)', order: 4 },
  { id: 'brand-pyrex', name: 'Pyrex (بايركس)', order: 5 },
  { id: 'brand-kassem', name: 'Kassem Home (كاسِم هوم)', order: 6 },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    code: '1254',
    name: 'طقم صحون بورسلين فاخر 24 قطعة بنقش ملكي',
    description: 'طقم صحون سفرة متكامل مقاوم للخدش وغسالة الأطباق، يتسع لـ 6 أشخاص، يشمل صحون مسطحة، عميقة، صحون حلوى وزبادي للشوربة.',
    price: 65,
    stock: 12,
    mainCategoryId: 'cat-glass',
    subCategoryId: 'sub-dinnerware',
    brandId: 'brand-luminarc',
    images: [
      {
        id: 'img-101-1',
        url: 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
      {
        id: 'img-101-2',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        isPrimary: false,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // New arrival
    updatedAt: Date.now(),
  },
  {
    id: 'prod-102',
    code: '3251',
    name: 'إبريق شاي وترمس تركي أصلي ستانلس ستيل عيار 18/10',
    description: 'إبريق مزدوج لتحضير الشاي التركي الأصيل، قاعدة كبسولية ثلاثية الطبقات لتوزيع حراري متجانس، يد عازلة للحرارة.',
    price: 38,
    stock: 18,
    mainCategoryId: 'cat-appliances',
    subCategoryId: 'sub-teapots',
    brandId: 'brand-korkmaz',
    images: [
      {
        id: 'img-102-1',
        url: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
      {
        id: 'img-102-2',
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        isPrimary: false,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // New arrival
    updatedAt: Date.now(),
  },
  {
    id: 'prod-103',
    code: '4502',
    name: 'طقم طناجر غرانيت غير لاصق 9 قطع بغطاء بيركس',
    description: 'أواني طهي عالية الجودة بطبقات غرانيت متعددة خالية من المواد الضارة PFOA، تشمل 3 طناجر بأحجام مختلفة ومقلاة وصينية.',
    price: 110,
    stock: 8,
    mainCategoryId: 'cat-kitchen',
    subCategoryId: 'sub-cookware',
    brandId: 'brand-neoflam',
    images: [
      {
        id: 'img-103-1',
        url: 'https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
      {
        id: 'img-103-2',
        url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
        isPrimary: false,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 10, // New arrival
    updatedAt: Date.now(),
  },
  {
    id: 'prod-104',
    code: '7820',
    name: 'طقم فناجين قهوة عربية وتركي مذهّب مع أطباق تقديم',
    description: 'طقم فاخر من 6 فناجين و6 أطباق بتفاصيل مذهبة راقية للمناسبات والضيافة، مصنوع من البورسلين الأبيض النقي.',
    price: 24,
    stock: 25,
    mainCategoryId: 'cat-appliances',
    subCategoryId: 'sub-cups',
    brandId: 'brand-kassem',
    images: [
      {
        id: 'img-104-1',
        url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 15,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-105',
    code: '6119',
    name: 'طقم صواني فرن زجاج حراري بايركس 3 قطع بأحجام مختلفة',
    description: 'صواني بيركس أصلية مقاومة لدرجات الحرارة العالية حتى 300 درجة مئوية، صالحة للفرن، المايكروويف، والثلاجة.',
    price: 22,
    stock: 15,
    mainCategoryId: 'cat-kitchen',
    subCategoryId: 'sub-pans',
    brandId: 'brand-pyrex',
    images: [
      {
        id: 'img-105-1',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-106',
    code: '8834',
    name: 'طقم ملاعق وشوك ستانلس ستيل فاخر 24 قطعة في علبة مخملية',
    description: 'طقم مائدة كامل عيار 18/10 بلمعة كروم تدوم طويلاً، مقاوم للصدأ، تصميم انسيابي مريح لقبضة اليد.',
    price: 45,
    stock: 14,
    mainCategoryId: 'cat-tableware',
    subCategoryId: 'sub-cutlery',
    brandId: 'brand-korkmaz',
    images: [
      {
        id: 'img-106-1',
        url: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 25,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-107',
    code: '9021',
    name: 'طقم علب حفظ طعام زجاجي محكم الإغلاق 4 قطع',
    description: 'أوعية تخزين زجاجية بغطاء سيليكون مانع للتسرب، تحافظ على نضارة الطعام لأطول فترة، مناسبة للتجميد والتسخين.',
    price: 19,
    stock: 30,
    mainCategoryId: 'cat-plastic',
    subCategoryId: 'sub-containers',
    brandId: 'brand-luminarc',
    images: [
      {
        id: 'img-107-1',
        url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-108',
    code: '3310',
    name: 'مقلاة تيفال غير لاصقة مع مؤشر ثيرموسبوت مقاس 28 سم',
    description: 'مقلاة أصلية تيفال بتقنية منع الالتصاق التيتانيوم، مزودة بالنقطة الحمراء الذكية لتحديد درجة الحرارة المثالية للبدء بالطهي.',
    price: 29,
    stock: 20,
    mainCategoryId: 'cat-kitchen',
    subCategoryId: 'sub-pans',
    brandId: 'brand-tefal',
    images: [
      {
        id: 'img-108-1',
        url: 'https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 35,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-109',
    code: '5540',
    name: 'صينية تقديم خشب طبيعي مع مقبضين أسود مطفي',
    description: 'صينية خشبية صلبة مقاومة للرطوبة بتصميم ريفي حديث مثالية لتقديم المشروبات والحلويات.',
    price: 18,
    stock: 16,
    mainCategoryId: 'cat-tableware',
    subCategoryId: 'sub-trays',
    brandId: 'brand-kassem',
    images: [
      {
        id: 'img-109-1',
        url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
    updatedAt: Date.now(),
  },
  {
    id: 'prod-110',
    code: '9901',
    name: 'طقم أكواب عصير كريستال فاخر 6 قطع شفاف',
    description: 'كؤوس عصير ومشروبات باردة بنقاء عالي ورنين كريستالي مميز وتصميم مريح لليد.',
    price: 16,
    stock: 22,
    mainCategoryId: 'cat-glass',
    subCategoryId: 'sub-cups',
    brandId: 'brand-luminarc',
    images: [
      {
        id: 'img-110-1',
        url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 45,
    updatedAt: Date.now(),
  },
  // Example out of stock product to demonstrate strict Rule 6 (inventory = 0 hidden in store, shown in admin)
  {
    id: 'prod-111',
    code: '7721',
    name: 'طقم سكاكين مطبخ احترافي مع حامل أكريليك دوار',
    description: 'سكاكين فولاذية حادة للغاية مع مقص مطبخ ومسن سكاكين، منتج عالي الطلب.',
    price: 42,
    stock: 0, // OUT OF STOCK: must NOT appear in store catalog!
    mainCategoryId: 'cat-kitchen',
    subCategoryId: 'sub-utensils',
    brandId: 'brand-korkmaz',
    images: [
      {
        id: 'img-111-1',
        url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 50,
    updatedAt: Date.now(),
  },
  // Example product with NO main category to demonstrate strict Rule 9 ("قيد الانتظار – يحتاج إلى تصنيف أساسي")
  {
    id: 'prod-112',
    code: '8800',
    name: 'سلة غسيل وتنظيم قابلة للطي بتصميم أنيق',
    description: 'سلة تخزين متعددة الاستخدامات لتنظيم الملابس والمقتنيات المنزلية.',
    price: 15,
    stock: 10,
    mainCategoryId: '', // NO MAIN CATEGORY: must be pending in admin!
    subCategoryId: '',
    brandId: 'brand-kassem',
    images: [
      {
        id: 'img-112-1',
        url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
        isPrimary: true,
      },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 55,
    updatedAt: Date.now(),
  },
];

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('subCategories')) {
        db.createObjectStore('subCategories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('brands')) {
        db.createObjectStore('brands', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic Store Operations
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function putToStore<T>(storeName: string, item: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Database Initializer & API
export const dbService = {
  async init(): Promise<void> {
    const products = await getAllFromStore<Product>('products');
    if (products.length === 0) {
      // Seed default initial data
      for (const p of INITIAL_PRODUCTS) {
        await putToStore('products', p);
      }
      for (const c of INITIAL_CATEGORIES) {
        await putToStore('categories', c);
      }
      for (const s of INITIAL_SUB_CATEGORIES) {
        await putToStore('subCategories', s);
      }
      for (const b of INITIAL_BRANDS) {
        await putToStore('brands', b);
      }
      await putToStore('settings', { id: 'main', ...DEFAULT_SETTINGS });
    }
  },

  async resetToSeed(): Promise<void> {
    const db = await openDB();
    const stores = ['products', 'categories', 'subCategories', 'brands', 'settings'];
    for (const s of stores) {
      const tx = db.transaction(s, 'readwrite');
      tx.objectStore(s).clear();
    }
    for (const p of INITIAL_PRODUCTS) {
      await putToStore('products', p);
    }
    for (const c of INITIAL_CATEGORIES) {
      await putToStore('categories', c);
    }
    for (const s of INITIAL_SUB_CATEGORIES) {
      await putToStore('subCategories', s);
    }
    for (const b of INITIAL_BRANDS) {
      await putToStore('brands', b);
    }
    await putToStore('settings', { id: 'main', ...DEFAULT_SETTINGS });
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return getAllFromStore<Product>('products');
  },

  async saveProduct(product: Product): Promise<void> {
    await putToStore('products', product);
  },

  async deleteProduct(id: string): Promise<void> {
    await deleteFromStore('products', id);
  },

  // Categories
  async getCategories(): Promise<MainCategory[]> {
    const cats = await getAllFromStore<MainCategory>('categories');
    return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async saveCategory(category: MainCategory): Promise<void> {
    await putToStore('categories', category);
  },

  async deleteCategory(id: string): Promise<void> {
    await deleteFromStore('categories', id);
  },

  // SubCategories
  async getSubCategories(): Promise<SubCategory[]> {
    return getAllFromStore<SubCategory>('subCategories');
  },

  async saveSubCategory(sub: SubCategory): Promise<void> {
    await putToStore('subCategories', sub);
  },

  async deleteSubCategory(id: string): Promise<void> {
    await deleteFromStore('subCategories', id);
  },

  // Brands
  async getBrands(): Promise<Brand[]> {
    const brands = await getAllFromStore<Brand>('brands');
    return brands.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async saveBrand(brand: Brand): Promise<void> {
    await putToStore('brands', brand);
  },

  async deleteBrand(id: string): Promise<void> {
    await deleteFromStore('brands', id);
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    const list = await getAllFromStore<StoreSettings & { id: string }>('settings');
    if (list.length > 0) {
      const { ...settings } = list[0];
      return settings as StoreSettings;
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: StoreSettings): Promise<void> {
    await putToStore('settings', { id: 'main', ...settings });
  },
};
