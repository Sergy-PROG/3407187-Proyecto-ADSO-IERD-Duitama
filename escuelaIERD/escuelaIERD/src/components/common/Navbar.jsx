import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    const userRol = user.rol || user.role;
    if (userRol === 'admin') return '/admin';
    if (userRol === 'profesor') return '/profesor';
    if (userRol === 'estudiante' || userRol === 'padre') return '/estudiante';
    return '/login';
  };

  const navLinks = [
    { to: '#inicio', label: 'Inicio' },
    { to: '#categorias', label: 'Categorías' },
    { to: '#entrenadores', label: 'Entrenadores' },
    { to: '#horarios', label: 'Horarios' },
    { to: '#inscripciones', label: 'Inscripciones' },
    { to: '#galeria', label: 'Galería' },
    { to: '#noticias', label: 'Noticias' },
    { to: '#contacto', label: 'Contacto' },
    { to: '#nosotros', label: 'Quiénes Somos' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-stone-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" 
              alt="IERD" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a 
                key={link.to} 
                href={link.to} 
                className={`px-3 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-neutral-600 hover:text-club-orange' : 'text-white hover:text-club-orange-light'}`}
              >
                {link.label}
              </a>
            ))}
            <Link 
              to={getDashboardLink()} 
              className={`ml-2 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${scrolled ? 'text-neutral-400 hover:text-club-orange' : 'text-white/60 hover:text-club-orange-light'}`}
            >
              <Icon icon="lucide:log-in" className="text-base" />
              <span className="hidden xl:inline">{user ? 'Mi Panel' : 'Ingresar'}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a href="#inscripciones" className="hidden sm:inline-flex items-center gap-2 bg-club-red hover:bg-club-red-light text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <Icon icon="lucide:user-plus" className="text-base" />
              Inscribirse
            </a>
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="lg:hidden p-2 rounded-lg transition-colors"
            >
              <Icon icon={mobileOpen ? "lucide:x" : "lucide:menu"} className={`text-2xl ${scrolled ? 'text-neutral-600' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-club-dark-2/98 backdrop-blur-xl border-t border-white/10 px-4 py-4">
          <div className="space-y-1">
            {navLinks.map(link => (
              <a key={link.to} href={link.to} className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium">
                {link.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 mt-2">
              <Link to={getDashboardLink()} className="flex items-center gap-2 px-4 py-3 text-white/50 hover:text-club-orange-light hover:bg-white/10 rounded-lg text-sm font-medium">
                <Icon icon="lucide:log-in" />
                {user ? 'Mi Panel' : 'Iniciar Sesión'}
              </Link>
            </div>
            <div className="pt-2">
              <a href="#inscripciones" className="flex items-center justify-center gap-2 bg-club-red text-white text-sm font-medium px-5 py-3 rounded-full">
                <Icon icon="lucide:user-plus" />
                Inscribirse ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}