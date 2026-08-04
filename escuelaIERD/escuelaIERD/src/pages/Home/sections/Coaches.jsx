const coaches = [
  {
    nombre: 'Carlos Mendoza',
    cargo: 'Director Técnico General',
    especialidad: 'Director Técnico',
    img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    badge: 'Director Técnico',
    badgeColor: 'bg-club-green',
    licencia: 'Licencia CONMEBOL Pro',
    experiencia: '20 años'
  },
  {
    nombre: 'Ana Rodríguez',
    cargo: 'DT. Categoría Femenino',
    especialidad: 'Entrenadora',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    badge: 'Entrenadora',
    badgeColor: 'bg-club-red',
    licencia: 'Licencia FIFA A',
    experiencia: '12 años'
  },
  {
    nombre: 'Miguel Torres',
    cargo: 'DT. Categoría Prejuvenil',
    especialidad: 'Preparador',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    badge: 'Preparador',
    badgeColor: 'bg-club-orange',
    licencia: 'Licencia Nacional B',
    experiencia: '8 años'
  },
  {
    nombre: 'Roberto Sánchez',
    cargo: 'Preparador Físico',
    especialidad: 'Preparador Físico',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    badge: 'Preparador Físico',
    badgeColor: 'bg-club-dark',
    licencia: 'Licenciado en Deporte',
    experiencia: '10 años'
  }
];

export default function Coaches() {
  return (
    <section id="entrenadores" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-orange text-xs font-semibold uppercase tracking-widest mb-4">Cuerpo Técnico</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            Nuestros <span className="text-club-green">entrenadores</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach, index) => (
            <div key={index} className="bg-stone-50 rounded-2xl overflow-hidden transition-all duration-300 card-hover">
              <div className="relative h-64 overflow-hidden">
                <img src={coach.img} alt={coach.nombre} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-club-dark/80 to-transparent p-4">
                  <span className={`text-xs ${coach.badgeColor} text-white px-2 py-1 rounded-full`}>{coach.badge}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-neutral-900">{coach.nombre}</h3>
                <p className="text-sm text-club-green font-medium mb-3">{coach.cargo}</p>
                <div className="space-y-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-2"><span>🏅</span> {coach.licencia}</div>
                  <div className="flex items-center gap-2"><span>💼</span> {coach.experiencia} de experiencia</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

