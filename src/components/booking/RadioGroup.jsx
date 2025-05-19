export default function RadioGroup({
  label,
  name,
  options,
  selected,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-4">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="accent-green-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
