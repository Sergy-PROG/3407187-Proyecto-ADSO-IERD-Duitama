const news = [
  {
    id: 1,
    titulo: 'IERD campeón del torneo intercolegial de Boyacá',
    descripcion: 'La categoría juvenil se coronó campeona tras una final electrizante.',
    tag: 'Torneo',
    tagColor: '#C62828',
    fecha: '15 Ene 2025',
    imagen: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    titulo: 'Abiertas inscripciones 2025 para todas las categorías',
    descripcion: 'Ya puedes reservar tu cupo para la nueva temporada.',
    tag: 'Inscripciones',
    tagColor: '#1B5E20',
    fecha: '8 Ene 2025',
    imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    titulo: 'Categoría femenino logra subcampeonato regional',
    descripcion: 'Las chicas demostraron su talento en el campeonato regional.',
    tag: 'Femenino',
    tagColor: '#4B5563',
    fecha: '20 Dic 2024',
    imagen: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80'
  }
];

export default function News() {
  return (
    <section id="noticias" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-green text-xs font-semibold uppercase tracking-widest mb-4">Noticias</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            Últimas <span className="text-club-red">novedades</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <div key={n.id} className="bg-stone-50 rounded-2xl overflow-hidden transition-all duration-300 border border-stone-100 card-hover">
              <div className="relative h-48 overflow-hidden">
                <img src={n.imagen} alt={n.tag} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute top-3 left-3" style={{ background: n.tagColor }}>
                  <span className="text-white text-xs font-bold px-3 py-1 rounded-full">{n.tag}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-neutral-400 mb-2 flex items-center gap-2">
                  <span>📅</span> {n.fecha}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">{n.titulo}</h3>
                <p className="text-sm text-neutral-500 line-clamp-3">{n.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

