import React from 'react';

export default function ToggleSwitch({
  id,
  checked = false,
  onChange = () => { },
  label = '',
  name,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          name={name}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-disabled:opacity-50
            transition-colors duration-300`}
        ></div>
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
            peer-checked:translate-x-5`}
        ></div>
      </label>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}
