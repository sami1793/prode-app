import { useEffect, useState } from "react";
import "./App.css";
import TabRanking from "./components/TabRanking";
import TabFixture from "./components/TabFixture";
import TabPuntuacion from "./components/TabPuntuacion";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_MSG,
  TORNEO_NOMBRE,
  TORNEO_SUBTITULO,
  COSTO_INSCRIPCION,
  PORCENTAJE_PREMIO,
  formatPesos,
} from "./utils";

// ─────────────────────────────────────────────
//  CONFIGURACIÓN
// ─────────────────────────────────────────────
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOnBT8XKTrCekQhzjp_LeX88ra_KlBI0qcJj0HGGJXk0wnN65LWYjHbPX1MqHMediAXoIo36j8msxa/pub?gid=0&single=true&output=csv";

const TABS = [
  { id: "ranking", label: "🏆 Ranking" },
  { id: "fixture", label: "📅 Fixture" },
  { id: "puntuacion", label: "📋 Puntuación" },
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
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

export default function App() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState("ranking");

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

  const totalParticipantes = ranking.length;
  const totalRecaudado = totalParticipantes * COSTO_INSCRIPCION;
  const calculoPremio = Math.round(totalRecaudado * (PORCENTAJE_PREMIO / 100));
  const premioEstimado = calculoPremio > 100000 ? calculoPremio : 100000;

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-banda" />
        <div className="header-content">
          <span className="header-eyebrow">⚽ Torneo de Los Siberianos</span>
          <h1 className="header-title">{TORNEO_NOMBRE}</h1>
          <p className="header-sub">{TORNEO_SUBTITULO}</p>
        </div>
      </header>

      {/* ── POZO — siempre visible ── */}
      {!loading && !error && totalParticipantes > 0 && (
        <div className="pozo-card">
          <div className="pozo-left">
            <span className="pozo-eyebrow">🏆 Premio estimado al ganador</span>
            <span className="pozo-monto">{formatPesos(premioEstimado)}</span>
            {/* <span className="pozo-detalle">
              {totalParticipantes} inscriptos · {formatPesos(totalRecaudado)} recaudados · {PORCENTAJE_PREMIO}% al ganador
            </span> */}
          </div>
          <div className="pozo-trofeo" aria-hidden="true">
            🏆
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <nav className="tabs-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${tabActiva === tab.id ? "tab-btn--activa" : ""}`}
            onClick={() => setTabActiva(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── CONTENIDO ── */}
      <main className="main">
        {tabActiva === "ranking" && (
          <TabRanking ranking={ranking} loading={loading} error={error} />
        )}
        {tabActiva === "fixture" && <TabFixture />}
        {tabActiva === "puntuacion" && <TabPuntuacion />}
      </main>

      {/* ── FOOTER / CÓMO PARTICIPAR — siempre visible ── */}
      <footer className="footer-participar">
        <div className="participar-card">
          <div className="participar-precio">
            <span className="precio-label">Inscripción</span>
            <span className="precio-valor">
              {formatPesos(COSTO_INSCRIPCION)}
            </span>
          </div>
          <p className="participar-desc">
            Pronosticá los resultados, sumá puntos y ganá premios. ¡Consultanos
            por WhatsApp para anotarte!
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
      </footer>
    </div>
  );
}
