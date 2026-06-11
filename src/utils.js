export const WHATSAPP_NUMBER = "5493885171772";
export const WHATSAPP_MSG = encodeURIComponent(
  "Hola! Quiero participar en el prode 🏆",
);
export const TORNEO_NOMBRE = "Prode Mundial 2026";
export const TORNEO_SUBTITULO = "16avos de final";
export const COSTO_INSCRIPCION = 3000;
export const PORCENTAJE_PREMIO = 30;

export function formatPesos(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
}
