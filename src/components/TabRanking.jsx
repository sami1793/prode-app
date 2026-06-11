const MEDAL = ["🥇", "🥈", "🥉"];
const PODIO_COLOR = ["podio-oro", "podio-plata", "podio-bronce"];
const PODIO_LABEL = ["1°", "2°", "3°"];

export default function TabRanking({ ranking, loading, error }) {
  const todosEnCero =
    ranking.length > 0 && ranking.every((p) => p.puntos === 0);
  const podio = ranking.slice(0, 3);

  return (
    <div className="tab-contenido">
      {/* ── PODIO ── */}
      <section className="section">
        <h2 className="section-title">Podio</h2>

        {loading && <p className="estado-msg">Cargando ranking…</p>}
        {error && <p className="estado-msg error">{error}</p>}

        {!loading && !error && todosEnCero && (
          <div className="podio-vacio">
            <span className="podio-vacio-icono">🏆</span>
            <p className="podio-vacio-texto">El podio se está armando...</p>
            <p className="podio-vacio-sub">
              ¡A la espera de los primeros resultados para ver quién lidera!
            </p>
          </div>
        )}

        {!loading && !error && !todosEnCero && podio.length > 0 && (
          <div className="podio">
            {[1, 0, 2].map((i) => {
              const p = podio[i];
              if (!p) return null;
              return (
                <div key={i} className={`podio-card ${PODIO_COLOR[i]}`}>
                  <span className="podio-medalla">{MEDAL[i]}</span>
                  <span className="podio-pos">{PODIO_LABEL[i]}</span>
                  <span className="podio-nombre">{p.nombre}</span>
                  <span className="podio-pts">{p.puntos} pts</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── TABLA COMPLETA ── */}
      {!loading && !error && ranking.length > 0 && (
        <section className="section">
          <h2 className="section-title">Ranking completo</h2>
          <div className="tabla-wrap">
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participante</th>
                  <th>Puntos</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((p, i) => (
                  <tr
                    key={i}
                    className={i < 3 && !todosEnCero ? "fila-top" : ""}
                  >
                    <td className="td-pos">
                      {i < 3 && !todosEnCero ? MEDAL[i] : i + 1}
                    </td>
                    <td className="td-nombre">{p.nombre}</td>
                    <td className="td-pts">{p.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
