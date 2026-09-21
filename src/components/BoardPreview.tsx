// A static board in the starting position, with two clocks and an empty move
// list — the shape of the two-player feature, shown while it is "coming soon".
const RANK8 = "♜♞♝♛♚♝♞♜";
// Solid glyphs for both sides (the outline "white" glyphs look thin); White is coloured ivory.
const RANK1 = "♜♞♝♛♚♝♞♜";
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function piece(r: number, f: number) {
  if (r === 0) return RANK8[f];
  if (r === 1) return "♟";
  if (r === 6) return "♟";
  if (r === 7) return RANK1[f];
  return "";
}

export function BoardPreview() {
  return (
    <div className="board-wrap" aria-hidden="true">
      <div className="clock">
        <span className="who">Black</span>
        <b>10:00</b>
      </div>
      <div className="board">
        {Array.from({ length: 64 }, (_, i) => {
          const r = Math.floor(i / 8), f = i % 8;
          const dark = (r + f) % 2 === 1;
          const p = piece(r, f);
          return (
            <span key={i} className={`sq ${dark ? "dark" : "light"}${r >= 6 ? " white-piece" : ""}`}>
              {p}
              {f === 0 && <i className="coord rank">{8 - r}</i>}
              {r === 7 && <i className="coord file">{FILES[f]}</i>}
            </span>
          );
        })}
      </div>
      <div className="clock on">
        <span className="who">White</span>
        <b>10:00</b>
      </div>
      <aside className="moves">
        <b>Moves</b>
        <ol>
          <li><span>1.</span><em>—</em><em>—</em></li>
          <li><span>2.</span><em>—</em><em>—</em></li>
          <li><span>3.</span><em>—</em><em>—</em></li>
        </ol>
        <div className="pair">
          <span>Shared code</span>
          <input value="RJ-4K7Q" readOnly disabled />
          <button type="button" disabled>Join</button>
        </div>
      </aside>
    </div>
  );
}
