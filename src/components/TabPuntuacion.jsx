const REGLAS = [
  {
    puntos: 10,
    color: "regla-oro",
    icono: "🎯",
    titulo: "Resultado Exacto",
    desc: "Acertás los goles exactos de ambos equipos.",
    ejemplo: { real: "2 - 1", pred: "2 - 1" },
  },
  {
    puntos: 7,
    color: "regla-celeste",
    icono: "✅",
    titulo: "Ganador + Goles de un equipo",
    desc: "Acertás quién gana (o que es empate) y los goles exactos de uno de los dos equipos.",
    ejemplo: { real: "2 - 1", pred: "2 - 0" },
  },
  {
    puntos: 5,
    color: "regla-verde",
    icono: "👍",
    titulo: "Solo Ganador o Empate",
    desc: "Acertás el resultado (victoria local, visitante o empate) pero no los goles de ninguno.",
    ejemplo: { real: "2 - 1", pred: "1 - 0" },
  },
  {
    puntos: 2,
    color: "regla-gris",
    icono: "🎲",
    titulo: "Goles de un equipo (errando ganador)",
    desc: "Acertás los goles exactos de uno de los equipos, pero errás quién gana.",
    ejemplo: { real: "2 - 1", pred: "0 - 1" },
  },
  {
    puntos: 0,
    color: "regla-rojo",
    icono: "❌",
    titulo: "Sin aciertos",
    desc: "No acertás ni el resultado ni los goles de ninguno de los equipos.",
    ejemplo: { real: "2 - 1", pred: "3 - 0" },
  },
];

export default function TabPuntuacion() {
  return (
    <div className="tab-contenido">
      <section className="section">
        <h2 className="section-title">Sistema de puntuación</h2>

        <p className="puntuacion-intro">
          Las reglas son <strong>excluyentes</strong>: se evalúan de mayor a
          menor y se aplica solo la primera que se cumple.
        </p>

        <div className="reglas-lista">
          {REGLAS.map((r) => (
            <div key={r.puntos} className={`regla-card ${r.color}`}>
              <div className="regla-puntos">{r.puntos} pts</div>
              <div className="regla-body">
                <div className="regla-titulo">
                  <span className="regla-icono">{r.icono}</span>
                  {r.titulo}
                </div>
                <p className="regla-desc">{r.desc}</p>
                <div className="regla-ejemplo">
                  <span className="ejemplo-label">Ejemplo</span>
                  <span className="ejemplo-item">
                    Real: <strong>{r.ejemplo.real}</strong>
                  </span>
                  <span className="ejemplo-sep">·</span>
                  <span className="ejemplo-item">
                    Tu pronóstico: <strong>{r.ejemplo.pred}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="puntuacion-nota">
          <span>💡</span>
          <p>
            Si un partido no tiene resultado aún, los puntos de ese partido
            aparecen como pendientes y se actualizan automáticamente cuando
            finaliza.
          </p>
        </div>
      </section>
    </div>
  );
}
