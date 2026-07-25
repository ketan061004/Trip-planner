"use client";

export default function Select({ label, options = [], className = "", id, ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
        </label>
      )}
      <select id={selectId} className="field" {...props}>
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const text = typeof o === "string" ? o : o.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
