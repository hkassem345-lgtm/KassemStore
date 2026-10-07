import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Share2,
  Lock,
  UtensilsCrossed,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setIsShareStoreOpen, setIsAdminOpen } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-16 border-t border-stone-800">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand & Description */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{settings.storeName}</h3>
                <p className="text-xs text-amber-400 font-medium">
                  {settings.storeSubtitle}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-4">
              {settings.storeDescription ||
                'متجر كاسِم ستور للأدوات المنزلية وتجهيزات المطبخ ومستلزمات البيت، نوفر لكم أجود المنتجات بأفضل الأسعار مع إمكانية التوصيل والطلب السريع عبر واتساب.'}
            </p>
            <button
              onClick={() => setIsShareStoreOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 px-3.5 py-2 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة رابط المتجر مع الأصدقاء</span>
            </button>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-2">
              معلومات التواصل والطلب
            </h4>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-300 hover:text-emerald-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-stone-400">واتساب الطلبات والاستفسارات:</span>
                <span dir="ltr" className="font-mono font-bold text-emerald-400 text-left">
                  {settings.whatsappNumber}
                </span>
              </div>
            </a>

            {/* Phones */}
            {settings.phoneNumbers?.map((phone, idx) => (
              <a
                key={idx}
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-stone-400">هاتف {idx + 1}:</span>
                  <span dir="ltr" className="font-mono font-medium text-left">
                    {phone}
                  </span>
                </div>
              </a>
            ))}

            {/* Address */}
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300 pt-1">
              <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block">العنوان:</span>
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Working hours & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-stone-800 pb-2">
              أوقات العمل والتواجد
            </h4>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300">
              <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block">ساعات الدوام:</span>
                <span className="leading-relaxed">{settings.workingHours}</span>
              </div>
            </div>

            {/* Social Links if available */}
            {settings.socialLinks && (
              <div className="pt-3">
                <span className="text-xs text-stone-400 block mb-2 font-medium">
                  تابعونا على وسائل التواصل:
                </span>
                <div className="flex items-center gap-2">
                  {settings.socialLinks.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs transition-colors"
                    >
                      فيسبوك
                    </a>
                  )}
                  {settings.socialLinks.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs transition-colors"
                    >
                      انستغرام
                    </a>
                  )}
                  {settings.socialLinks.tiktok && (
                    <a
                      href={settings.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs transition-colors"
                    >
                      تيك توك
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Link (Requirement 10) */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ{' '}
            <span className="text-stone-300 font-semibold">{settings.storeName}</span>
          </div>

          {/* Discreet, tiny admin entry link as strictly requested: "يتم وضع رابط/زر صغير جداً في أسفل الصفحة باسم: 'الإدارة' ولا يكون بارزاً في الموقع" */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[11px] text-stone-600 hover:text-stone-400 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus:text-stone-300"
              title="بوابة إدارة المتجر"
            >
              <Lock className="w-2.5 h-2.5 opacity-60" />
              <span>الإدارة</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
