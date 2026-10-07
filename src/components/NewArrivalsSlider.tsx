import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const NewArrivalsSlider: React.FC = () => {
  const { newArrivals, settings, setActiveProductModal } = useStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft: sLeft, scrollWidth, clientWidth } = sliderRef.current;
    // In RTL, scrollLeft can be negative or positive depending on browser implementation
    const maxScroll = scrollWidth - clientWidth;
    const absScroll = Math.abs(sLeft);
    setCanScrollRight(absScroll > 10);
    setCanScrollLeft(absScroll < maxScroll - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [newArrivals]);

  if (!newArrivals || newArrivals.length === 0) return null;

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scrollByAmount = (direction: 'right' | 'left') => {
    if (!sliderRef.current) return;
    const step = 320;
    // In RTL, scrolling right goes backwards in scrollLeft
    const amount = direction === 'right' ? step : -step;
    sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="mb-10 pt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5 fill-amber-500/30" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
              وصل حديثاً
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                جديد المتجر
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              أحدث التشكيلات والأدوات المنزلية التي وصلت لمستودعاتنا
            </p>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollByAmount('right')}
            title="السابق"
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByAmount('left')}
            title="التالي"
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Draggable Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onScroll={checkScroll}
        className={`flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth cursor-grab select-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
      >
        {newArrivals.map((prod) => {
          const primaryImg =
            prod.images.find((img) => img.isPrimary)?.url ||
            prod.images[0]?.url ||
            'https://images.unsplash.com/photo-1584990347449-399a9a3854eb?auto=format&fit=crop&w=600&q=80';

          return (
            <div
              key={prod.id}
              onClick={() => {
                if (!isDragging) {
                  setActiveProductModal(prod);
                }
              }}
              style={{ scrollSnapAlign: 'start' }}
              className="flex-shrink-0 w-[240px] sm:w-[270px] bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              {/* Product Image strictly contained */}
              <div className="relative aspect-4/3 bg-stone-50/90 p-4 flex items-center justify-center border-b border-stone-100">
                <span className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-xs">
                  #{prod.code}
                </span>
                <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  جديد
                </span>
                <img
                  src={primaryImg}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Text Info */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {prod.name}
                </h3>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-baseline gap-1 text-amber-700 font-black text-base">
                    <span>{prod.price}</span>
                    <span className="text-xs font-bold text-stone-600">
                      {settings.currencySymbol}
                    </span>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold group-hover:translate-x-[-2px] transition-transform">
                    تفاصيل ←
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
