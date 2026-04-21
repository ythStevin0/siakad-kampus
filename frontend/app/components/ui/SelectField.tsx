import React from "react";

type SelectOption = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  options: SelectOption[];
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
};

export function SelectField({
  label,
  name,
  options,
  required = false,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-100 
          focus:outline-none transition-all appearance-none
          ${error 
            ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" 
            : "border-zinc-800 focus:border-red-500/50"
          }
        `}
      >
        <option value="" disabled>Pilih {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[10px] text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}
