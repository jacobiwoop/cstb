import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slideApi } from '../utils/api';

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await slideApi.getAll();
        setSlides(data);
      } catch (error) {
        console.error("Erreur chargement slides hero", error);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (slides.length === 0) {
    return <div className="w-full h-screen min-h-[600px] bg-[#007cba]"></div>;
  }

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden group pt-20">
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-sans font-bold mb-4 tracking-tight drop-shadow-lg max-w-5xl">
                {slide.title}
              </h2>
              <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-sans font-semibold mb-6 drop-shadow-md">
                {slide.subtitle}
              </h3>
              <p className="text-gray-100 text-lg md:text-xl max-w-3xl mb-10 drop-shadow">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={slide.primaryLink} 
                  className="bg-white text-[#007cba] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-custom-2"
                >
                  {slide.primaryBtn}
                </Link>
                {slide.secondaryLink.startsWith('#') ? (
                  <a 
                    href={slide.secondaryLink}
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors shadow-custom-2 backdrop-blur-sm"
                  >
                    {slide.secondaryBtn}
                  </a>
                ) : (
                  <Link 
                    to={slide.secondaryLink} 
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors shadow-custom-2 backdrop-blur-sm"
                  >
                    {slide.secondaryBtn}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next} 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none"></div>
    </div>
  );
}
