import { Icon } from '@iconify/react';

const scheduleData = [
  { categoria: 'Infantil', dias: 'Lun, Mié, Vie', horario: '4:00 - 5:30 PM', color: 'club-green' },
  { categoria: 'Prejuvenil', dias: 'Lun, Mié, Vie', horario: '5:30 - 7:00 PM', color: 'club-orange' },
  { categoria: 'Juvenil', dias: 'Mar, Jue, Sáb', horario: '5:00 - 7:00 PM', color: 'club-red' },
  { categoria: 'Femenino', dias: 'Mar, Jue', horario: '4:30 - 6:00 PM', color: 'white' },
];

export default function Schedule() {
  return (
    <section id="horarios" className="py-20 lg:py-32 bg-club-dark-2 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-club-orange-light text-xs font-semibold uppercase tracking-widest mb-4">Horarios y Sedes</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
            Entrena en el <span className="text-club-green-light">mejor escenario</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="lucide:calendar" className="text-club-orange-light" />
              Horarios de Entrenamiento
            </h3>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left px-4 py-3 font-medium text-white/70">Categoría</th>
                    <th className="text-left px-4 py-3 font-medium text-white/70">Días</th>
                    <th className="text-left px-4 py-3 font-medium text-white/70">Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item, index) => (
                    <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <span className={`w-2 h-2 bg-${item.color} rounded-full inline-block mr-2`}></span>
                        {item.categoria}
                      </td>
                      <td className="px-4 py-3 text-white/70">{item.dias}</td>
                      <td className="px-4 py-3">
                        <span className={`bg-${item.color}/20 text-${item.color === 'white' ? 'white' : item.color + '-light'} px-2 py-0.5 rounded text-xs`}>
                          {item.horario}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon icon="lucide:map-pin" className="text-club-red-light" />
              Nuestras Sedes
            </h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-club-green/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-club-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon icon="lucide:building" className="text-club-green-light text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Sede Principal - Complejo IERD</h4>
                    <p className="text-sm text-white/50 mb-2">Cra 15 #45-20, Duitama, Boyacá</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">Cancha principal</span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">Vestidores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

