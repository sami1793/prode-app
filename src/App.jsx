import { useEffect, useState } from "react";
import "./App.css";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOnBT8XKTrCekQhzjp_LeX88ra_KlBI0qcJj0HGGJXk0wnN65LWYjHbPX1MqHMediAXoIo36j8msxa/pub?gid=0&single=true&output=csv";

const WHATSAPP_NUMBER = "5493518078579"; // ← reemplazá con tu número (código de país sin +)
const WHATSAPP_MSG = encodeURIComponent(
  "Hola! Quiero participar en el prode 🏆",
);
const INSCRIPCION_PRECIO = "$3.000";
const TORNEO_NOMBRE = "Prode Mundial 2026";
const TORNEO_SUBTITULO = "16avos";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  // Ignoramos la primera fila (cabecera) y parseamos el resto
  return lines
    .slice(1)
    .map((line) => {
      const cols = line.split(",");
      const nombre = cols[0]?.trim().replace(/"/g, "") || "";
      const puntos = parseInt(cols[1]?.trim(), 10) || 0;
      return { nombre, puntos };
    })
    .filter((p) => p.nombre !== "")
    .sort((a, b) => b.puntos - a.puntos);
}

const MEDAL = ["🥇", "🥈", "🥉"];
const PODIO_COLOR = ["podio-oro", "podio-plata", "podio-bronce"];
const PODIO_LABEL = ["1°", "2°", "3°"];

export default function App() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el ranking.");
        return res.text();
      })
      .then((text) => {
        setRanking(parseCSV(text));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const podio = ranking.slice(0, 3);
  const resto = ranking.slice(3);

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-banda" />
        <div className="header-content">
          <span className="header-eyebrow">⚽ Torneo de pronósticos</span>
          <h1 className="header-title">{TORNEO_NOMBRE}</h1>
          <p className="header-sub">{TORNEO_SUBTITULO}</p>
        </div>
      </header>

      <main className="main">
        {/* ── PODIO ── */}
        <section className="section">
          <h2 className="section-title">Podio</h2>

          {loading && <p className="estado-msg">Cargando ranking…</p>}
          {error && <p className="estado-msg error">{error}</p>}

          {!loading && !error && podio.length > 0 && (
            <div className="podio">
              {/* Orden visual: 2° izq, 1° centro, 3° der */}
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
                    <tr key={i} className={i < 3 ? "fila-top" : ""}>
                      <td className="td-pos">{i < 3 ? MEDAL[i] : i + 1}</td>
                      <td className="td-nombre">{p.nombre}</td>
                      <td className="td-pts">{p.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── CÓMO PARTICIPAR ── */}
        <section className="section seccion-participar">
          <h2 className="section-title">¿Querés participar?</h2>
          <div className="participar-card">
            <div className="participar-precio">
              <span className="precio-label">Inscripción</span>
              <span className="precio-valor">{INSCRIPCION_PRECIO}</span>
            </div>
            <p className="participar-desc">
              Pronosticá los resultados de cada fecha, sumá puntos y ganá
              premios. ¡Consultanos por WhatsApp para anotarte!
            </p>
            <a
              className="btn-whatsapp"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Anotarme por WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Prode organizado con ❤️ · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
