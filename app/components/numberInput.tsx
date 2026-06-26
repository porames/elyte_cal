interface NumberInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder?: string;
}

export default function NumberInput({
    label,
    value,
    onChange,
    placeholder,
}: NumberInputProps) {
    return (
        <div className="flex items-center space-x-4">
            <label className="w-40 text-gray-700 font-medium">{label}</label>

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
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
        </div>
    );
}
