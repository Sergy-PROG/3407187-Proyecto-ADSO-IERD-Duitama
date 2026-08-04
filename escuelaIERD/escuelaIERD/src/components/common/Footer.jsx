export default function Footer() {
  return (
    <footer className="bg-club-dark-2 text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <img 
              src="https://z-cdn-media.chatglm.cn/files/516a5f04-6e55-4ceb-81e8-94086280e9e9.png?auth_key=1881094052-0ee0aa60a1c64b45b3789769d7962f28-0-44d8028c7f144c3af3794074fe8cadfc" 
              alt="IERD" 
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-sm text-white/50 leading-relaxed">
              Escuela Regional Deportiva de Duitama, Boyacá. Formando talento con pasión y disciplina.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#inicio" className="hover:text-club-green-light transition-colors">Inicio</a></li>
              <li><a href="#categorias" className="hover:text-club-green-light transition-colors">Categorías</a></li>
              <li><a href="#entrenadores" className="hover:text-club-green-light transition-colors">Entrenadores</a></li>
              <li><a href="#inscripciones" className="hover:text-club-green-light transition-colors">Inscripciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Más</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#galeria" className="hover:text-club-green-light transition-colors">Galería</a></li>
              <li><a href="#noticias" className="hover:text-club-green-light transition-colors">Noticias</a></li>
              <li><a href="#contacto" className="hover:text-club-green-light transition-colors">Contacto</a></li>
              <li><a href="#nosotros" className="hover:text-club-green-light transition-colors">Quiénes Somos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Contacto</h4>
            <div className="space-y-2 text-sm text-white/50">
              <p>+57 310 456 7890</p>
              <p>escuela@ierdduitama.com</p>
              <p>Cra 15 #45-20, Duitama</p>
            </div>
          </div>
        </div>
        <div className="stripe-green-red h-0.5 rounded-full mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© 2025 IERD Duitama — Escuela Deportiva. Todos los derechos reservados.</p>
          <p className="text-xs text-white/20">SENA ADSO | Ficha 3407187</p>
        </div>
      </div>
    </footer>
  );
}