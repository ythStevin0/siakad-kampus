import React from "react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-100 
          focus:outline-none transition-all
          placeholder:text-zinc-700
          ${error 
            ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20" 
            : "border-zinc-800 focus:border-red-500/50"
          }
        `}
      />

      {error && (
        <p className="text-[10px] text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}
