import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  AlertCircle,
  RotateCcw,
  KeyRound,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const StoreSettingsManager: React.FC = () => {
  const { settings, updateSettings, resetToDefaultSeed } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [newPassword, setNewPassword] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [phoneInput, setPhoneInput] = useState(
    settings.phoneNumbers?.join(', ') || ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phones = phoneInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const updated: StoreSettings = {
      ...formData,
      phoneNumbers: phones,
      adminPasswordHash: newPassword.trim()
        ? newPassword.trim()
        : formData.adminPasswordHash,
    };

    await updateSettings(updated);
    setNewPassword('');
    setSuccessToast('تم حفظ جميع الإعدادات بنجاح!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        'تحذير: هل أنت متأكد من إعادة ضبط البيانات إلى الحالة الافتراضية؟ سيتم استعادة الأصناف والتصنيفات الأولية.'
      )
    ) {
      await resetToDefaultSeed();
      setSuccessToast('تمت إعادة ضبط البيانات إلى الحالة الافتراضية.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                إعدادات المتجر ومعلومات التواصل
              </h2>
              <p className="text-xs text-stone-500">
                تعديل بيانات كاسِم ستور، رقم واتساب الطلبات، وساعات العمل وكلمة المرور
              </p>
            </div>
          </div>

          {successToast && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Logo Management Section */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span>شعار المتجر (Logo)</span>
                  <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                    يظهر في أعلى المتجر والهيدر
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  يمكنك رفع صورة الشعار من جهازك أو وضع رابط، وكذلك تحميل صورة الشعار الحالية.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Logo Preview Container */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-2 border-dashed border-stone-300 p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-2xs group">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="شعار المتجر"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-xs text-stone-400 font-semibold block">
                      لا يوجد شعار
                    </span>
                    <span className="text-[10px] text-stone-400">
                      سيظهر الشعار الافتراضي
                    </span>
                  </div>
                )}
              </div>

              {/* Upload & Actions */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Upload from device */}
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs">
                    <span>رفع شعار من الهاتف أو الكمبيوتر</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setFormData({ ...formData, logoUrl: result });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Download current logo */}
                  {formData.logoUrl && (
                    <a
                      href={formData.logoUrl}
                      download="kassem_store_logo.png"
                      className="flex items-center gap-1.5 px-3 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors"
                      title="تحميل / تنزيل صورة الشعار إلى جهازك"
                    >
                      <span>تحميل صورة الشعار (تنزيل)</span>
                    </a>
                  )}

                  {/* Delete logo button */}
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="px-3 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      حذف الشعار
                    </button>
                  )}
                </div>

                {/* Or enter URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    أو الصق رابط صورة الشعار:
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, logoUrl: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Store Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم المتجر الرسمي
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الشعار اللفظي (السطر الفرعي)
              </label>
              <input
                type="text"
                value={formData.storeSubtitle}
                onChange={(e) =>
                  setFormData({ ...formData, storeSubtitle: e.target.value })
                }
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              وصف المتجر (الذي يظهر في الفوتر وعند المشاركة)
            </label>
            <textarea
              rows={3}
              value={formData.storeDescription}
              onChange={(e) =>
                setFormData({ ...formData, storeDescription: e.target.value })
              }
              className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* WhatsApp & Phones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>رقم WhatsApp الأساسي للطلبات (مع رمز الدولة)</span>
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                placeholder="مثال: 96170123456"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                dir="ltr"
                required
              />
              <span className="text-[11px] text-stone-400 block mt-1">
                هذا هو الرقم الذي تفتح عليه محادثة الطلب عند الضغط على "إرسال الطلب عبر WhatsApp".
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>أرقام الهواتف الأرضية / الخلوية (افصل بفاصلة)</span>
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+961 70 123 456, +961 01 234 567"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Address & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>العنوان الجغرافي للمحل</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>ساعات وأيام العمل</span>
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) =>
                  setFormData({ ...formData, workingHours: e.target.value })
                }
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-700 mb-3 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>روابط وسائل التواصل الاجتماعي</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  رابط فيسبوك
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        facebook: e.target.value,
                      },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  رابط انستغرام
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        instagram: e.target.value,
                      },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  رابط تيك توك
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.tiktok || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        tiktok: e.target.value,
                      },
                    })
                  }
                  placeholder="https://tiktok.com/@..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Currency & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رمز العملة
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) =>
                  setFormData({ ...formData, currencySymbol: e.target.value })
                }
                placeholder="$ أو د.أ أو ل.ل"
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                <span>تغيير كلمة مرور الإدارة (اترك فارغاً لعدم التغيير)</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="كلمة مرور جديدة..."
                className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center justify-center gap-2 text-xs font-bold text-stone-600 hover:text-red-700 p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط البيانات للأصلية (Reset Seed)</span>
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ جميع التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
