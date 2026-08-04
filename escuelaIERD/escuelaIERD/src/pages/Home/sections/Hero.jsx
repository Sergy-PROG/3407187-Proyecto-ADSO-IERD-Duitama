import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: 'Encendemos pasión por el fútbol',
    subtitle: 'En IERD Duitama forjamos talento, disciplina y amor por el deporte. Más que una escuela, una familia con la antorcha encendida.',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80'
  });

  useEffect(() => {
    const stored = localStorage.getItem('ierd_hero');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setHeroData(prev => ({ ...prev, ...data }));
      } catch (e) {}
    }
  }, []);

  const words = heroData.title.split(' ');

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroData.image} alt="Estadio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-club-dark-2/95 via-club-dark/80 to-club-dark-2/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-club-dark-2/90 via-transparent to-transparent" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-1.5 stripe-green-red z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <div className="animate-fade-up" style={{ animationDelay: '200ms', opacity: 0 }}>
            <span className="inline-flex items-center gap-2 bg-club-orange/20 backdrop-blur-sm border border-club-orange/30 text-club-orange-light text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Icon icon="lucide:flame" />
              IERD Duitama — Escuela Deportiva
            </span>
          </div>

          <h1 className="animate-fade-up font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6" style={{ animationDelay: '400ms', opacity: 0 }}>
            {words.map((word, i) => {
              if (word.toLowerCase() === 'pasión') {
                return <span key={i} className="text-club-orange-light">{word} </span>;
              }
              if (i === words.length - 1 && word.toLowerCase() === 'fútbol') {
                return <span key={i}>{word}</span>;
              }
              return word + ' ';
            })}
          </h1>

          <p className="animate-fade-up text-lg sm:text-xl text-white/70 mb-8 max-w-lg" style={{ animationDelay: '600ms', opacity: 0 }}>
            {heroData.subtitle}
          </p>

          <div className="animate-fade-up flex flex-wrap gap-4" style={{ animationDelay: '800ms', opacity: 0 }}>
            <a href="#inscripciones" className="inline-flex items-center gap-2 bg-club-red hover:bg-club-red-light text-white font-medium px-8 py-4 rounded-full transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-club-red/25 text-base">
              <Icon icon="lucide:user-plus" className="text-lg" />
              Inscripciones
            </a>
            <a href="#contacto" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium px-8 py-4 rounded-full transition-all hover:-translate-y-1 text-base">
              <Icon icon="lucide:phone" className="text-lg" />
              Contáctanos
            </a>
            <a href="#horarios" className="inline-flex items-center gap-2 bg-transparent border-2 border-club-orange/50 hover:border-club-orange text-club-orange-light hover:text-white font-medium px-8 py-4 rounded-full transition-all hover:-translate-y-1 text-base">
              <Icon icon="lucide:clock" className="text-lg" />
              Horarios
            </a>
          </div>

          <div className="animate-fade-up mt-12 flex gap-8 sm:gap-12" style={{ animationDelay: '1000ms', opacity: 0 }}>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-club-orange-light">15</div>
              <div className="text-sm text-white/50 mt-1">Años de experiencia</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-club-green-light">500</div>
              <div className="text-sm text-white/50 mt-1">Jugadores formados</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-club-red-light">30</div>
              <div className="text-sm text-white/50 mt-1">Torneos ganados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Descubre más</span>
          <Icon icon="lucide:chevron-down" className="text-2xl" />
        </div>
      </div>
    </section>
  );
}

