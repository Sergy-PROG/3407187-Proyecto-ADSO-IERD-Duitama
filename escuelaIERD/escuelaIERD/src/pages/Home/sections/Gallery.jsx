const galleryImages = [
  'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1434648408720-6b4ed8e7b153?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-20 lg:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-orange text-xs font-semibold uppercase tracking-widest mb-4">Galería</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            Momentos que <span className="text-club-green">encuentan</span>
          </h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Cada entrenamiento, cada gol, cada abrazo es una llama que se enciende para siempre.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {galleryImages.map((img, index) => (
            <div key={index} className={`gallery-item relative rounded-2xl overflow-hidden cursor-pointer ${index === 0 ? 'col-span-2 row-span-2 h-80' : 'h-48'}`}>
              <img src={img} alt="Galería" className="w-full h-full object-cover transition-transform duration-500" />
              <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-club-dark/80 via-club-dark/20 to-transparent opacity-0 transition-opacity duration-300 flex items-end p-5">
                <span className="text-xs bg-club-green text-white px-2 py-1 rounded-full">IERD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

