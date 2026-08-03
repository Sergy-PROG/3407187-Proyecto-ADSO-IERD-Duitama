export default function Contact() {
  return (
    <section id="contacto" className="py-20 lg:py-32 bg-club-dark-2 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-orange-light text-xs font-semibold uppercase tracking-widest mb-4">Contacto</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Estamos para <span className="text-club-green-light">ti</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-club-green/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-club-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-club-green-light text-xl">📞</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Teléfono</h4>
                  <p className="text-sm text-white/50">+57 310 456 7890</p>
                  <p className="text-sm text-white/50">+57 8 760 1234</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-club-orange/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-club-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-club-orange-light text-xl">✉️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Correo electrónico</h4>
                  <p className="text-sm text-white/50">escuela@ierdduitama.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-club-red/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-club-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-club-red-light text-xl">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-0.5">Ubicación</h4>
                  <p className="text-sm text-white/50">Cra 15 #45-20, Duitama, Boyacá</p>
                  <p className="text-sm text-white/50">Colombia</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <h4 className="font-semibold text-white mb-3">Síguenos</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-club-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span>📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-club-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span>📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-club-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span>▶️</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-club-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-club-green/20 rounded-xl flex items-center justify-center">
                  <span className="text-club-green-light text-lg">💬</span>
                </div>
                <h3 className="font-semibold text-xl">Envíanos un mensaje</h3>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-club-green/50 focus:border-club-green/50 outline-none" />
                  <input type="email" placeholder="Correo" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-club-green/50 focus:border-club-green/50 outline-none" />
                </div>
                <textarea rows="5" placeholder="Mensaje" className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-club-green/50 focus:border-club-green/50 outline-none resize-none"></textarea>
                <button type="submit" className="w-full bg-club-green hover:bg-club-green-light text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-club-green/25 flex items-center justify-center gap-2">
                  <span>📤</span> Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

