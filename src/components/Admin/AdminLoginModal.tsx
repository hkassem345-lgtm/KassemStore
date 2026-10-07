import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isAdminOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    const success = loginAdmin(password.trim());
    if (success) {
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-black text-stone-900 text-base">تسجيل دخول الإدارة</h3>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <p className="text-xs text-stone-500 leading-relaxed">
            لوحة التحكم مخصصة لمدير متجر كاسِم ستور فقط. يرجى إدخال كلمة المرور للمتابعة.
          </p>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
                placeholder="أدخل كلمة المرور..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-600 absolute left-2.5 top-2.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>كلمة المرور غير صحيحة، يرجى المحاولة مجدداً.</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              دخول إلى لوحة الإدارة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
