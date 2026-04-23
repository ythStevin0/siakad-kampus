import React from "react";

type TextAreaFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
};

export function TextAreaField({
  label,
  name,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full bg-zinc-950 border rounded-lg px-3 py-2 text-sm text-zinc-100 
          focus:outline-none transition-all
          placeholder:text-zinc-700
          resize-none
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
