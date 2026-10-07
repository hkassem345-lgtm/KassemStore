import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StoreShareModal: React.FC = () => {
  const { isShareStoreOpen, setIsShareStoreOpen, settings } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isShareStoreOpen) return null;

  const currentUrl = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: settings.storeName,
          text: `تفضل بزيارة كتالوغ ${settings.storeName} لأجود الأدوات المنزلية ومستلزمات المطبخ:`,
          url: currentUrl,
        });
        setIsShareStoreOpen(false);
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const text = `تفضل بزيارة كتالوغ ${settings.storeName} للأدوات المنزلية ومستلزمات المطبخ:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">مشاركة المتجر</h3>
              <p className="text-xs text-stone-500">{settings.storeName}</p>
            </div>
          </div>
          <button
            onClick={() => setIsShareStoreOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-3">
          {/* Quick WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>مشاركة عبر WhatsApp</span>
          </button>

          {/* Native Mobile Share Button */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>مشاركة عبر خيارات الهاتف</span>
            </button>
          )}

          {/* Copy Store URL Link */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-600 mb-1.5">
              أو انسخ رابط المتجر مباشرة:
            </label>
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl p-2">
              <Globe className="w-4 h-4 text-stone-400 flex-shrink-0 mr-1" />
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs text-stone-700 font-mono outline-hidden select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
