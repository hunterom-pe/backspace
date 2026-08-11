import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          color: "#f3f5fa",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "#1b2aa6",
              border: "5px solid #f3f5fa",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9L3.6 12.9a1.1 1.1 0 0 1 0-1.8L9 5Z"
                stroke="#f3f5fa"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 9.5 16.5 14.5M16.5 9.5 12.5 14.5"
                stroke="#f3f5fa"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800 }}>backspace</div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#a6abc2" }}>
          Hit backspace on the last twenty years of the internet.
        </div>
      </div>
    ),
    { ...size },
  );
}
