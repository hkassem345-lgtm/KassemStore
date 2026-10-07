import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ImageLightboxModal: React.FC = () => {
  const { lightboxData, closeLightbox } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (lightboxData) {
      setCurrentIndex(lightboxData.initialIndex || 0);
      setZoomLevel(1);
    }
  }, [lightboxData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handleNext(); // RTL: left goes to next
      if (e.key === 'ArrowRight') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData, currentIndex]);

  if (!lightboxData || lightboxData.images.length === 0) return null;

  const images = lightboxData.images;
  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity">
      {/* Top Toolbar */}
      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full text-stone-200">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-xs text-stone-300 hidden sm:inline">
            الصورة كاملة دون أي اقتصاص
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            title="تكبير الصورة"
            className="p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="تصغير الصورة"
            className="p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleResetZoom}
            title="إعادة الحجم الافتراضي"
            className="p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={closeLightbox}
            title="إغلاق"
            className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white transition-colors mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            title="الصورة السابقة"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
          <button
            onClick={handleNext}
            title="الصورة التالية"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Image Container with guaranteed object-fit: contain & Zoom */}
      <div
        className="w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <img
          src={currentImage}
          alt={`عرض الصورة ${currentIndex + 1}`}
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
          }}
          className="select-none shadow-2xl rounded-sm"
          draggable={false}
        />
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 p-2 z-20 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setZoomLevel(1);
                setCurrentIndex(idx);
              }}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-stone-900 flex-shrink-0 transition-all ${
                idx === currentIndex
                  ? 'border-amber-500 scale-105 shadow-lg'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
