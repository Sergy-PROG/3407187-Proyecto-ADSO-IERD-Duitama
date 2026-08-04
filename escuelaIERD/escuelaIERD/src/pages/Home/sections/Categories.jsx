import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function Categories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      nombre: 'Infantil',
      rango: '5-10 años',
      descripcion: 'Iniciación deportiva con énfasis en diversión y fundamentos básicos.',
      horario: 'Lun, Mié, Vie - 4:00 PM',
      imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
      color: '#1B5E20'
    },
    {
      id: 2,
      nombre: 'Prejuvenil',
      rango: '11-14 años',
      descripcion: 'Desarrollo técnico-táctico y preparación para la competencia.',
      horario: 'Lun, Mié, Vie - 5:30 PM',
      imagen: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80',
      color: '#4B5563'
    },
    {
      id: 3,
      nombre: 'Juvenil',
      rango: '15-18 años',
      descripcion: 'Alto rendimiento y preparación para torneos departamentales.',
      horario: 'Mar, Jue, Sáb - 5:00 PM',
      imagen: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=600&q=80',
      color: '#C62828'
    },
    {
      id: 4,
      nombre: 'Femenino',
      rango: '12+ años',
      descripcion: 'Empoderamiento femenino a través del fútbol competitivo.',
      horario: 'Mar, Jue - 4:30 PM',
      imagen: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80',
      color: '#2D2D2D'
    }
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('ierd_categorias');
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const icons = {
    'Infantil': 'lucide:baby',
    'Prejuvenil': 'lucide:zap',
    'Juvenil': 'lucide:trophy',
    'Femenino': 'lucide:shield'
  };

  const colorClasses = {
    'Infantil': 'club-green',
    'Prejuvenil': 'club-orange',
    'Juvenil': 'club-red',
    'Femenino': 'club-dark'
  };

  return (
    <section id="categorias" className="py-20 lg:py-32 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-green text-xs font-semibold uppercase tracking-widest mb-4">Categorías</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            Encuentra tu <span className="text-club-red">categoría</span>
          </h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Organizamos nuestros equipos por edades para garantizar un desarrollo adecuado y competencia justa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const colorClass = colorClasses[cat.nombre] || 'club-green';
            return (
              <div 
                key={cat.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 transition-all duration-300 cursor-pointer card-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <div className="absolute top-3 left-3" style={{ background: cat.color }}>
                    <span className="text-white text-xs font-bold px-3 py-1 rounded-full">{cat.rango}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 bg-${colorClass}-50 rounded-lg flex items-center justify-center`}>
                      <Icon icon={icons[cat.nombre] || 'lucide:star'} className={`text-${colorClass} text-sm`} />
                    </div>
                    <h3 className="font-semibold text-lg text-neutral-900">{cat.nombre}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">{cat.descripcion}</p>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:clock" />
                      {cat.horario}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:map-pin" />
                      Cancha Principal
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

