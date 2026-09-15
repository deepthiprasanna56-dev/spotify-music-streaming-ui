export default function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg aspect-square p-4 bg-gradient-to-br ${category.color} cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md group select-none`}
    >
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words max-w-[75%] leading-snug">
        {category.name}
      </h3>

      {/* Angled Album Art in Corner */}
      <div className="absolute -bottom-2 -right-3 w-20 sm:w-24 aspect-square rounded-md overflow-hidden shadow-2xl transform rotate-[25deg] translate-x-2 translate-y-2 group-hover:rotate-[20deg] group-hover:scale-105 transition-transform duration-300">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
