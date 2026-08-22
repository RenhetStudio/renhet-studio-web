import { ImageResponse } from "next/og";

export const alt = "Renhet Studio - Friendly detailed worlds filled with passion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #647586 0%, #8fb8d8 54%, #d9e3e8 100%)",
          color: "#fffdf3",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: 8, textTransform: "uppercase" }}>
          Renhet Studio
        </div>
        <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1, marginTop: 42, maxWidth: 950 }}>
          Friendly detailed worlds filled with passion.
        </div>
        <div style={{ fontSize: 30, marginTop: 36 }}>
          Independent international game studio
        </div>
      </div>
    ),
    size,
  );
}
