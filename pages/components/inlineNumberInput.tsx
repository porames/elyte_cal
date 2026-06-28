
interface InlineNumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}

export default function InlineNumberInput({ value, onChange, placeholder }: InlineNumberInputProps) {
  const width = Math.max(2, String(value ?? placeholder ?? "").length) + 1.5;
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? undefined : Number(v));
      }}
      onKeyDown={(e) => { if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }}
      placeholder={placeholder}
      className="chip-input focus-ring mono inline-block text-center rounded px-1 mx-1"
      style={{
        width: `${width}ch`,
        border: "none",
        borderBottom: "1.5px dashed var(--teal)",
        background: "transparent",
        color: "var(--teal)",
      }}
    />
  );
}
