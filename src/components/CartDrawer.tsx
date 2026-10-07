import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    cartItemCount,
    updateCartQuantity,
    updateCartNote,
    removeFromCart,
    clearCart,
    sendCartToWhatsApp,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer Container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">سلة المشتريات</h2>
              <p className="text-xs text-stone-500">
                {cartItemCount} {cartItemCount === 1 ? 'قطعة' : 'قطع'} في السلة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 hover:underline px-2 py-1 font-medium"
              >
                تفريغ السلة
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-1">السلة فارغة حالياً</h3>
            <p className="text-sm text-stone-500 max-w-xs mb-6">
              تصفح الكتالوج وأضف ما يعجبك من أواني وتحف ومستلزمات منزلية راقية.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>تصفح المنتجات الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
            {cart.map((item) => {
              const primaryImg =
                item.product.images.find((img) => img.isPrimary)?.url ||
                item.product.images[0]?.url ||
                'https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=400&q=80';

              const itemTotal = item.product.price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs transition-all hover:border-amber-300 flex flex-col gap-3"
                >
                  {/* Top row: Image, Name, Code, Price, Delete */}
                  <div className="flex items-start gap-3">
                    {/* Uncropped Thumbnail (contain) */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 bg-stone-50 rounded-xl p-1.5 border border-stone-200 flex items-center justify-center flex-shrink-0">
                      <img
                        src={primaryImg}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[11px] font-mono font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                            #{item.product.code}
                          </span>
                          <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 mt-1">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          title="حذف هذا الصنف"
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold font-mono min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-stone-600 hover:bg-stone-100 font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Subtotal */}
                        <div className="text-left">
                          <span className="text-xs text-stone-400 block">
                            {item.quantity} × {item.product.price}
                            {settings.currencySymbol}
                          </span>
                          <span className="font-black text-amber-700 text-sm">
                            {itemTotal} {settings.currencySymbol}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Independent Item Note Field (Crucial Requirement 4) */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>ملاحظة خاصة بهذا الصنف:</span>
                    </div>
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) =>
                        updateCartNote(item.product.id, e.target.value)
                      }
                      placeholder="مثلاً: أريد اللون الأبيض، أو حجم كبير..."
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-800 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer with Total & WhatsApp Button (Requirement 5) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-stone-700">إجمالي المشتريات:</span>
              <div className="flex items-baseline gap-1 font-black text-2xl text-amber-700">
                <span>{cartTotal}</span>
                <span className="text-base text-stone-600">
                  {settings.currencySymbol}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-normal">
              سيتم تجهيز رسالة تفصيلية تحتوي على كود كل صنف وملاحظاتكم وإرسالها
              مباشرة عبر WhatsApp للرقم المعتمد: {settings.whatsappNumber}
            </p>

            <button
              onClick={sendCartToWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-base cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>إرسال الطلب عبر WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
