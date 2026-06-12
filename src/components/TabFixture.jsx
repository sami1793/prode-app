import { useEffect, useState } from "react";

const FIXTURE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOnBT8XKTrCekQhzjp_LeX88ra_KlBI0qcJj0HGGJXk0wnN65LWYjHbPX1MqHMediAXoIo36j8msxa/pub?gid=1036444454&single=true&output=csv";

const BANDERAS = {
  Argentina: "ar",
  México: "mx",
  Sudáfrica: "za",
  "Corea del Sur": "kr",
  "República Checa": "cz",
  Canadá: "ca",
  "Bosnia y Herzegovina": "ba",
  "Estados Unidos": "us",
  Paraguay: "py",
  Qatar: "qa",
  Suiza: "ch",
  Brasil: "br",
  Marruecos: "ma",
  Haití: "ht",
  Escocia: "gb-sct",
  Australia: "au",
  Turquía: "tr",
  Argelia: "dz",
  Austria: "at",
  Jordania: "jo",
  Alemania: "de",
  Francia: "fr",
  España: "es",
  Portugal: "pt",
  Inglaterra: "gb-eng",
  Italia: "it",
  "Países Bajos": "nl",
  Bélgica: "be",
  Croacia: "hr",
  Dinamarca: "dk",
  Senegal: "sn",
  Ghana: "gh",
  Camerún: "cm",
  Nigeria: "ng",
  Ecuador: "ec",
  Uruguay: "uy",
  Colombia: "co",
  Chile: "cl",
  Perú: "pe",
  Venezuela: "ve",
  "Costa Rica": "cr",
  Jamaica: "jm",
  "Arabia Saudita": "sa",
  Irán: "ir",
  Japón: "jp",
  "Nueva Zelanda": "nz",
  Túnez: "tn",
  Egipto: "eg",
  Mali: "ml",
  Guinea: "gn",
  Tanzania: "tz",
  Zambia: "zm",
  Serbia: "rs",
  Polonia: "pl",
  Suecia: "se",
  Noruega: "no",
  Eslovaquia: "sk",
  Eslovenia: "si",
  Albania: "al",
  Georgia: "ge",
  Ucrania: "ua",
  Rumania: "ro",
  Hungría: "hu",
};

function parseFixtureCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  return lines
    .slice(1)
    .map((line) => {
      // Manejar comas dentro de comillas
      const cols =
        line.match(/(".*?"|[^",]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) ||
        line.split(",");
      const obj = {};
      header.forEach((h, i) => {
        obj[h] = (cols[i] || "").trim().replace(/"/g, "");
      });
      return obj;
    })
    .filter((p) => p.equipo_local);
}

const FILTRO_ESTADO = ["Todos", "Finalizados", "Pendientes"];

export default function TabFixture() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    fetch(FIXTURE_CSV_URL)
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar el fixture.");
        return r.text();
      })
      .then((text) => {
        setPartidos(parseFixtureCSV(text));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Grupos únicos ordenados A-Z
  const grupos = [
    "Todos",
    ...Array.from(new Set(partidos.map((p) => p.grupo))).sort(),
  ];

  // Aplicar filtros
  const partidosFiltrados = partidos.filter((p) => {
    const tieneResultado = p.goles_local !== "" && p.goles_visitante !== "";
    if (filtroGrupo !== "Todos" && p.grupo !== filtroGrupo) return false;
    if (filtroEstado === "Finalizados" && !tieneResultado) return false;
    if (filtroEstado === "Pendientes" && tieneResultado) return false;
    return true;
  });

  // Agrupar por jornada
  const porJornada = partidosFiltrados.reduce((acc, p) => {
    const key = `Fecha ${p.jornada}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  if (loading) return <p className="estado-msg">Cargando fixture…</p>;
  if (error) return <p className="estado-msg error">{error}</p>;

  return (
    <div className="tab-contenido">
      <section className="section">
        <h2 className="section-title">Fixture</h2>

        {/* ── Filtro estado ── */}
        <div className="filtros-wrap">
          <div className="filtros-grupo">
            {FILTRO_ESTADO.map((f) => (
              <button
                key={f}
                className={`chip ${filtroEstado === f ? "chip--activo" : ""}`}
                onClick={() => setFiltroEstado(f)}
              >
                {f === "Finalizados"
                  ? "✅ Finalizados"
                  : f === "Pendientes"
                    ? "⏳ Pendientes"
                    : f}
              </button>
            ))}
          </div>

          {/* ── Filtro grupo ── */}
          <div className="filtros-grupo filtros-grupo--scroll">
            {grupos.map((g) => (
              <button
                key={g}
                className={`chip ${filtroGrupo === g ? "chip--activo" : ""}`}
                onClick={() => setFiltroGrupo(g)}
              >
                {g === "Todos" ? g : `Grupo ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Partidos ── */}
        {Object.keys(porJornada).length === 0 && (
          <p className="estado-msg">No hay partidos con ese filtro.</p>
        )}

        {Object.entries(porJornada).map(([jornada, ps]) => (
          <div key={jornada} className="fixture-jornada">
            <h3 className="fixture-jornada-titulo">{jornada}</h3>

            <div className="fixture-lista">
              {ps.map((p) => {
                const tieneResultado =
                  p.goles_local !== "" && p.goles_visitante !== "";
                const codigoLocal = BANDERAS[p.equipo_local] || "un";
                const codigoVisit = BANDERAS[p.equipo_visitante] || "un";

                return (
                  <div
                    key={p.id}
                    className={`fixture-card ${tieneResultado ? "fixture-card--finalizado" : ""}`}
                  >
                    {/* Info superior */}
                    <div className="fixture-meta">
                      <span className="fixture-grupo">Grupo {p.grupo}</span>
                      <span className="fixture-fecha">
                        {p.fecha} · {p.hora}
                      </span>
                      <span className="fixture-estadio">🏟 {p.estadio}</span>
                    </div>

                    {/* Fila principal */}
                    <div className="fixture-fila">
                      {/* Equipo local */}
                      <div className="fixture-equipo fixture-equipo--local">
                        <span
                          className={`fi fi-${codigoLocal} fixture-bandera`}
                        />
                        <span className="fixture-nombre">{p.equipo_local}</span>
                      </div>

                      {/* Marcador o VS */}
                      <div
                        className={`fixture-marcador ${tieneResultado ? "fixture-marcador--resultado" : ""}`}
                      >
                        {tieneResultado ? (
                          <>
                            <span className="marcador-gol">
                              {p.goles_local}
                            </span>
                            <span className="marcador-sep">-</span>
                            <span className="marcador-gol">
                              {p.goles_visitante}
                            </span>
                          </>
                        ) : (
                          <span className="marcador-vs">vs</span>
                        )}
                      </div>

                      {/* Equipo visitante */}
                      <div className="fixture-equipo fixture-equipo--visitante">
                        <span
                          className={`fi fi-${codigoVisit} fixture-bandera`}
                        />
                        <span className="fixture-nombre">
                          {p.equipo_visitante}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
