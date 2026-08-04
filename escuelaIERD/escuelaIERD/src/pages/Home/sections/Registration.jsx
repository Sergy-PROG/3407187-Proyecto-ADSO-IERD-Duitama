export default function Registration() {
  return (
    <section id="inscripciones" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-red text-xs font-semibold uppercase tracking-widest mb-4">Inscripciones Abiertas 2025</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight mb-4">
            Únete a la <span className="text-club-green">familia</span> IERD
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-club-green-50 rounded-2xl p-6 border border-club-green-100">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>📋</span> Requisitos
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="text-club-green text-lg mt-0.5">✅</span> Edad entre 5 y 18 años
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="text-club-green text-lg mt-0.5">✅</span> Certificado médico deportivo vigente
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="text-club-green text-lg mt-0.5">✅</span> Fotocopia del documento de identidad
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="text-club-green text-lg mt-0.5">✅</span> Autorización del padre/madre o acudiente
                </li>
              </ul>
            </div>

            <div className="bg-club-dark rounded-2xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>💳</span> Costos y Pagos
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">Inscripción anual</span>
                  <span className="font-bold text-club-orange-light">$150.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">Mensualidad</span>
                  <span className="font-bold text-club-green-light">$120.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/70">Uniforme completo</span>
                  <span className="font-bold text-club-red-light">$95.000</span>
                </div>
              </div>
              <h4 className="text-sm font-medium text-white/50 mb-2">Métodos de pago:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">💰 Efectivo</span>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">🏦 Transferencia</span>
                <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">💳 Tarjeta</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-100 sticky top-24">
              <h3 className="font-semibold text-xl text-neutral-900 mb-6">Formulario de Pre-Inscripción</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                  <input type="text" placeholder="Apellido" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                  <select className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none bg-white">
                    <option value="">Seleccionar categoría</option>
                    <option>Infantil (5-10 años)</option>
                    <option>Prejuvenil (11-14 años)</option>
                    <option>Juvenil (15-18 años)</option>
                    <option>Femenino (12+ años)</option>
                  </select>
                </div>
                <input type="text" placeholder="Nombre del acudiente" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Teléfono" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                  <input type="email" placeholder="Correo electrónico" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-club-green/30 focus:border-club-green outline-none" />
                </div>
                <button type="submit" className="w-full bg-club-red hover:bg-club-red-light text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-club-red/25">
                  Enviar Pre-Inscripción
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

