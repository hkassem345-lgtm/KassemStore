import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, MainCategory, SubCategory, Brand, StoreSettings, CartItem } from '../types';
import { dbService } from '../services/db';

interface StoreContextType {
  products: Product[];
  categories: MainCategory[];
  subCategories: SubCategory[];
  brands: Brand[];
  settings: StoreSettings;
  cart: CartItem[];
  isLoading: boolean;

  // Filter & Search states
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMainCategory: string | null;
  setSelectedMainCategory: (id: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (id: string | null) => void;
  selectedBrand: string | null;
  setSelectedBrand: (id: string | null) => void;
  priceSort: 'default' | 'price-asc' | 'price-desc' | 'newest';
  setPriceSort: (sort: 'default' | 'price-asc' | 'price-desc' | 'newest') => void;

  // Modals & Panels
  activeProductModal: Product | null;
  setActiveProductModal: (p: Product | null) => void;
  lightboxData: { images: string[]; initialIndex: number } | null;
  openLightbox: (images: string[], initialIndex?: number) => void;
  closeLightbox: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isShareStoreOpen: boolean;
  setIsShareStoreOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Storefront Computed Products
  visibleProducts: Product[];
  newArrivals: Product[];
  pendingProducts: Product[]; // Admin: Missing main category
  outOfStockProducts: Product[]; // Admin: stock == 0

  // Cart operations
  addToCart: (product: Product, quantity?: number, note?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartNote: (productId: string, note: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // WhatsApp Actions
  sendCartToWhatsApp: () => void;
  sendSingleProductToWhatsApp: (product: Product) => void;

  // Admin Data Management
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  quickUpdateStock: (id: string, newStock: number) => Promise<void>;
  quickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  saveCategory: (cat: MainCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveSubCategory: (sub: SubCategory) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  saveBrand: (brand: Brand) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
  reloadAllData: () => Promise<void>;
  resetToDefaultSeed: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Kassem Store | كاسِم ستور',
    storeSubtitle: 'عالم الأدوات المنزلية ومستلزمات المطبخ الفاخرة',
    storeDescription: '',
    whatsappNumber: '96170123456',
    phoneNumbers: ['+961 70 123 456'],
    address: 'بيروت - أوتوستراد السيد هادي',
    workingHours: 'يومياً من 9:00 صباحاً حتى 9:00 مساءً',
    socialLinks: {},
    whatsappOrderIntro: 'طلب جديد من كاسِم ستور:',
    adminPasswordHash: 'kassem123',
    currencySymbol: '$',
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kassem_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<'default' | 'price-asc' | 'price-desc' | 'newest'>('default');

  // Modals
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [lightboxData, setLightboxData] = useState<{ images: string[]; initialIndex: number } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShareStoreOpen, setIsShareStoreOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('kassem_admin_auth') === 'true';
  });

  // Load Database
  const loadData = async () => {
    try {
      setIsLoading(true);
      await dbService.init();
      const [prods, cats, subs, brs, sett] = await Promise.all([
        dbService.getProducts(),
        dbService.getCategories(),
        dbService.getSubCategories(),
        dbService.getBrands(),
        dbService.getSettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setSubCategories(subs);
      setBrands(brs);
      setSettings(sett);
    } catch (err) {
      console.error('Failed to load database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kassem_store_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Keep active product modal synced if updated
  useEffect(() => {
    if (activeProductModal) {
      const updated = products.find((p) => p.id === activeProductModal.id);
      if (updated) {
        setActiveProductModal(updated);
      }
    }
  }, [products]);

  // Strict visibility logic:
  // Rule 6: stock > 0
  // Rule 9: mainCategoryId MUST exist and not be empty
  const storeEligibleProducts = useMemo(() => {
    return products.filter((p) => {
      const hasStock = p.stock > 0;
      const hasMainCategory = Boolean(p.mainCategoryId && p.mainCategoryId.trim() !== '');
      return hasStock && hasMainCategory;
    });
  }, [products]);

  // Pending products for Admin (Missing main category)
  const pendingProducts = useMemo(() => {
    return products.filter((p) => !p.mainCategoryId || p.mainCategoryId.trim() === '');
  }, [products]);

  // Out of stock products for Admin
  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 0);
  }, [products]);

  // New Arrivals (Section وصل حديثاً - sorted by createdAt desc, max 12 items)
  const newArrivals = useMemo(() => {
    return [...storeEligibleProducts]
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 12);
  }, [storeEligibleProducts]);

  // Filtered & Searched products for main catalog
  const visibleProducts = useMemo(() => {
    let result = [...storeEligibleProducts];

    // Search filter: code, name, description, brand name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const brandMap = new Map(brands.map((b) => [b.id, b.name.toLowerCase()]));
      result = result.filter((p) => {
        const matchCode = p.code?.toLowerCase().includes(q);
        const matchName = p.name?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchBrand = p.brandId ? brandMap.get(p.brandId)?.includes(q) : false;
        return matchCode || matchName || matchDesc || matchBrand;
      });
    }

    // Main Category filter
    if (selectedMainCategory) {
      result = result.filter((p) => p.mainCategoryId === selectedMainCategory);
    }

    // Sub Category filter
    if (selectedSubCategory) {
      result = result.filter((p) => p.subCategoryId === selectedSubCategory);
    }

    // Brand filter
    if (selectedBrand) {
      result = result.filter((p) => p.brandId === selectedBrand);
    }

    // Price / Newest sort
    if (priceSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (priceSort === 'newest') {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return result;
  }, [
    storeEligibleProducts,
    searchQuery,
    selectedMainCategory,
    selectedSubCategory,
    selectedBrand,
    priceSort,
    brands,
  ]);

  // Lightbox
  const openLightbox = (images: string[], initialIndex: number = 0) => {
    if (images && images.length > 0) {
      setLightboxData({ images, initialIndex });
    }
  };

  const closeLightbox = () => {
    setLightboxData(null);
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1, note = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          product, // fresh copy
          quantity: newQty,
          note: note ? note : existing.note,
        };
        return updated;
      } else {
        const validQty = Math.min(Math.max(1, quantity), product.stock);
        return [...prev, { product, quantity: validQty, note: note || '' }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      });
    });
  };

  const updateCartNote = (productId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, note } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // WhatsApp Order Generator (Requirement 5)
  const sendCartToWhatsApp = () => {
    if (cart.length === 0) return;

    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const storeUrl = window.location.origin;

    let message = `طلب جديد من ${settings.storeName}\n\n`;

    cart.forEach((item, index) => {
      const subtotal = item.product.price * item.quantity;
      const noteText = item.note.trim() ? item.note.trim() : 'بدون ملاحظة';

      message += `${index + 1}. ${item.product.name}\n`;
      message += `   الكود: ${item.product.code}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${item.product.price}${settings.currencySymbol} (المجموع: ${subtotal}${settings.currencySymbol})\n`;
      message += `   الملاحظة: ${noteText}\n\n`;
    });

    message += `الإجمالي: ${cartTotal}${settings.currencySymbol}\n\n`;
    message += `رابط المتجر: ${storeUrl}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Single Product WhatsApp Order
  const sendSingleProductToWhatsApp = (product: Product) => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const productUrl = `${window.location.origin}?product=${product.code}`;

    let message = `مرحباً، أريد الاستفسار والطلب من متجر ${settings.storeName}:\n\n`;
    message += `اسم المنتج: ${product.name}\n`;
    message += `الكود: ${product.code}\n`;
    message += `السعر: ${product.price}${settings.currencySymbol}\n`;
    message += `رابط المنتج: ${productUrl}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (password === settings.adminPasswordHash || password === 'kassem123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('kassem_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('kassem_admin_auth');
    setIsAdminOpen(false);
  };

  // Admin Data Actions
  const saveProduct = async (product: Product) => {
    await dbService.saveProduct(product);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = async (id: string) => {
    await dbService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (activeProductModal?.id === id) {
      setActiveProductModal(null);
    }
  };

  const quickUpdateStock = async (id: string, newStock: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const updated = { ...prod, stock: Math.max(0, newStock), updatedAt: Date.now() };
    await dbService.saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const quickUpdatePrice = async (id: string, newPrice: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const updated = { ...prod, price: Math.max(0, newPrice), updatedAt: Date.now() };
    await dbService.saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const saveCategory = async (cat: MainCategory) => {
    await dbService.saveCategory(cat);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === cat.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = cat;
        return next;
      }
      return [...prev, cat];
    });
  };

  const deleteCategory = async (id: string) => {
    await dbService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Any product with this main category loses it and moves to pending
    setProducts((prev) =>
      prev.map((p) => {
        if (p.mainCategoryId === id) {
          const updated = { ...p, mainCategoryId: '', subCategoryId: '', updatedAt: Date.now() };
          dbService.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const saveSubCategory = async (sub: SubCategory) => {
    await dbService.saveSubCategory(sub);
    setSubCategories((prev) => {
      const idx = prev.findIndex((s) => s.id === sub.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = sub;
        return next;
      }
      return [...prev, sub];
    });
  };

  const deleteSubCategory = async (id: string) => {
    await dbService.deleteSubCategory(id);
    setSubCategories((prev) => prev.filter((s) => s.id !== id));
    setProducts((prev) =>
      prev.map((p) => {
        if (p.subCategoryId === id) {
          const updated = { ...p, subCategoryId: '', updatedAt: Date.now() };
          dbService.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const saveBrand = async (brand: Brand) => {
    await dbService.saveBrand(brand);
    setBrands((prev) => {
      const idx = prev.findIndex((b) => b.id === brand.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = brand;
        return next;
      }
      return [...prev, brand];
    });
  };

  const deleteBrand = async (id: string) => {
    await dbService.deleteBrand(id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    setProducts((prev) =>
      prev.map((p) => {
        if (p.brandId === id) {
          const updated = { ...p, brandId: '', updatedAt: Date.now() };
          dbService.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    await dbService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const reloadAllData = async () => {
    await loadData();
  };

  const resetToDefaultSeed = async () => {
    await dbService.resetToSeed();
    await loadData();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        subCategories,
        brands,
        settings,
        cart,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedMainCategory,
        setSelectedMainCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedBrand,
        setSelectedBrand,
        priceSort,
        setPriceSort,
        activeProductModal,
        setActiveProductModal,
        lightboxData,
        openLightbox,
        closeLightbox,
        isCartOpen,
        setIsCartOpen,
        isShareStoreOpen,
        setIsShareStoreOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        visibleProducts,
        newArrivals,
        pendingProducts,
        outOfStockProducts,
        addToCart,
        updateCartQuantity,
        updateCartNote,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        sendCartToWhatsApp,
        sendSingleProductToWhatsApp,
        saveProduct,
        deleteProduct,
        quickUpdateStock,
        quickUpdatePrice,
        saveCategory,
        deleteCategory,
        saveSubCategory,
        deleteSubCategory,
        saveBrand,
        deleteBrand,
        updateSettings,
        reloadAllData,
        resetToDefaultSeed,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
