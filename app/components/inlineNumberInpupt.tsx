
interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}

export default function InlineNumberInpupt({
  value,
  onChange,
  placeholder,
}: NumberInputProps) {
  return (

    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? undefined : Number(val));
      }}
      onKeyDown={(e) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
        }
      }}
      placeholder={placeholder}
      className="inline-block w-12 text-right text-sm md:text-base bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5 mx-1 rounded-sm"
    />


  );
}

