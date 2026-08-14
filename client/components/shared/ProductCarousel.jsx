import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="w-full p-6 text-center border-2 border-dashed border-stone-200 rounded-xl">
        <p className="text-xs font-medium text-stone-400">No matching products found.</p>
      </div>
    );
  }

  return (
    <div className="relative group flex items-center">
      {products.length > 1 && (
        <button 
          onClick={() => scroll('left')} 
          className="hidden md:flex absolute left-0 -ml-4 z-20 bg-white shadow-lg border border-stone-200 rounded-full p-2 text-stone-600 hover:text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 pt-2 custom-scrollbar w-full px-2 [-webkit-overflow-scrolling:touch]">
        {products.map((prod, pIdx) => (
          <a key={pIdx} href={prod.link} target="_blank" rel="noreferrer" className="shrink-0 w-[240px] md:w-[320px] group/card border border-stone-200/60 rounded-2xl overflow-hidden hover:border-amber-300 hover:shadow-md transition-all bg-stone-50 block">
            <div className="relative w-full h-[200px] md:h-[260px] bg-white">
              <img loading="lazy" src={prod.thumbnail || "/product_placeholder.png"} alt={prod.name} className="w-full h-full object-contain p-6 mix-blend-multiply group-hover/card:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 bg-white border-t border-stone-100">
              <p className="text-sm font-semibold text-stone-800 line-clamp-2 leading-tight group-hover/card:text-amber-700 transition-colors">{prod.name}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm font-bold text-stone-900">{prod.price}</p>
                <span className="text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-100 px-2 py-1 rounded">{prod.source}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {products.length > 1 && (
        <button 
          onClick={() => scroll('right')} 
          className="hidden md:flex absolute right-0 -mr-4 z-20 bg-white shadow-lg border border-stone-200 rounded-full p-2 text-stone-600 hover:text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
