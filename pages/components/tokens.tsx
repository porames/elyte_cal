
export default function Tokens() {
    return (
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
      .elyte-root {
        --ink: #10202E;
        --muted: #5C7080;
        --bg: #F6F7F9;
        --surface: #FFFFFF;
        --border: #E3E7EA;
        --teal: #0E7C7B;
        --teal-soft: #E6F2F1;
        --blue: #2E6F95;
        --blue-soft: #E9F1F6;
        --green: #2F9E68;
        --green-soft: #EAF7F0;
        --red: #C0392B;
        --red-soft: #FBEAE8;
        font-family: 'IBM Plex Sans', sans-serif;
        color: var(--ink);
        background: var(--bg);
      }
      .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      .elyte-root input[type="number"] {
        font-family: 'IBM Plex Mono', monospace;
      }
      .elyte-root input[type="number"]::-webkit-outer-spin-button,
      .elyte-root input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none; margin: 0;
      }
      .focus-ring:focus { outline: none; box-shadow: 0 0 0 3px var(--teal-soft); border-color: var(--teal); }
      .tile { transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }
      .tile:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(16,32,46,0.08); border-color: var(--teal); }
      .chip-input { transition: background .12s ease; }
      .chip-input:hover { background: var(--teal-soft); }
    `}</style>
    );
}
