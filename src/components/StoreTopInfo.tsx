import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Share2,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const StoreTopInfo: React.FC = () => {
  const { settings, setIsShareStoreOpen } = useStore();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="bg-gradient-to-b from-stone-900 to-stone-850 text-white rounded-3xl p-5 sm:p-7 mb-8 shadow-lg border border-stone-800 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 -left-20 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Store Logo & Identity */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Logo Container (strictly uncropped contain) */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-md border-2 border-amber-500/30 overflow-hidden">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.storeName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex flex-col items-center justify-center text-center">
                <UtensilsCrossed className="w-7 h-7 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Kassem</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {settings.storeName}
              </h1>
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                كتالوغ الأدوات المنزلية
              </span>
            </div>

            <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-1">
              {settings.storeSubtitle || 'عالم الأدوات المنزلية ومستلزمات المطبخ الفاخرة'}
            </p>

            <p className="text-xs text-stone-300 mt-1.5 max-w-2xl line-clamp-2 md:line-clamp-none leading-relaxed">
              {settings.storeDescription ||
                'أرقى أطقم أواني الطهي، البورسلين، والزجاج بأفضل الأسعار. تصفح الكتالوج واطلب ما ترغب به مباشرة عبر واتساب.'}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          <a
            href={`https://wa.me/${cleanWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل واتساب</span>
          </a>

          <button
            onClick={() => setIsShareStoreOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm border border-stone-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>مشاركة المتجر</span>
          </button>
        </div>
      </div>

      {/* Store Information Grid (In the top of the page) */}
      <div className="mt-6 pt-5 border-t border-stone-800/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* 1. Address */}
        <div className="flex items-start gap-2.5 bg-stone-800/40 p-3 rounded-2xl border border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-stone-400 font-bold block mb-0.5">
              العنوان والفرع:
            </span>
            <span className="text-stone-200 font-medium leading-relaxed block text-xs">
              {settings.address}
            </span>
          </div>
        </div>

        {/* 2. Working Hours */}
        <div className="flex items-start gap-2.5 bg-stone-800/40 p-3 rounded-2xl border border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-stone-400 font-bold block mb-0.5">
              ساعات وأيام العمل:
            </span>
            <span className="text-stone-200 font-medium leading-relaxed block text-xs">
              {settings.workingHours}
            </span>
          </div>
        </div>

        {/* 3. Phone Numbers */}
        <div className="flex items-start gap-2.5 bg-stone-800/40 p-3 rounded-2xl border border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-stone-400 font-bold block mb-0.5">
              أرقام التواصل:
            </span>
            <div className="space-y-0.5">
              {settings.phoneNumbers?.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${p.replace(/[^0-9+]/g, '')}`}
                  className="text-stone-200 hover:text-amber-400 transition-colors font-mono font-medium block text-left text-xs"
                  dir="ltr"
                >
                  {p}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 4. WhatsApp Direct & Social */}
        <div className="flex items-start gap-2.5 bg-stone-800/40 p-3 rounded-2xl border border-stone-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-stone-400 font-bold block mb-0.5">
              واتساب الطلبات المباشر:
            </span>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-mono font-bold block text-left text-xs mb-1.5"
              dir="ltr"
            >
              {settings.whatsappNumber}
            </a>

            {/* Social media pills */}
            {settings.socialLinks && (
              <div className="flex items-center gap-1.5">
                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-stone-700/60 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded transition-colors"
                  >
                    فيسبوك
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-stone-700/60 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded transition-colors"
                  >
                    انستغرام
                  </a>
                )}
                {settings.socialLinks.tiktok && (
                  <a
                    href={settings.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] bg-stone-700/60 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded transition-colors"
                  >
                    تيك توك
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
