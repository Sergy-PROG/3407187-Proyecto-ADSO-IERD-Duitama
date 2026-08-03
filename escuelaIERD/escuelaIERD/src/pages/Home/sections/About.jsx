export default function About() {
  return (
    <section id="nosotros" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-green text-xs font-semibold uppercase tracking-widest mb-4">Quiénes Somos</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            La <span className="text-club-red">antorcha</span> que enciende sueños
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden h-80 lg:h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1434648408720-6b4ed8e7b153?auto=format&fit=crop&w=800&q=80" 
              alt="Cancha IERD" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-neutral-600 text-lg leading-relaxed">
              La <strong className="text-club-green">Iniciativa Escuela Regional Deportiva (IERD) Duitama</strong> nació con la misión de formar integralmente a niños, niñas y jóvenes a través del fútbol, combinando disciplina deportiva con valores humanos.
            </p>
            <p className="text-neutral-500 leading-relaxed">
              Desde hace más de 15 años, hemos sido semillero de talento para Boyacá y Colombia, participando en torneos departamentales, nacionales e internacionales.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-club-green">247</div>
                <p className="text-xs text-neutral-400 mt-1">Estudiantes activos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-club-red">12</div>
                <p className="text-xs text-neutral-400 mt-1">Profesores</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-club-orange">4</div>
                <p className="text-xs text-neutral-400 mt-1">Categorías</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}