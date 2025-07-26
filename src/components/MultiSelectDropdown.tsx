import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const removeSelected = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  const selectedLabels = selectedValues.map(value => 
    options.find(option => option.value === value)?.label || value
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      
      {/* Selected Values Display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedLabels.map((label, index) => (
            <span
              key={selectedValues[index]}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
            >
              {label}
              <button
                type="button"
                onClick={() => removeSelected(selectedValues[index])}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border border-gray-300 rounded-md px-2 py-1 text-xs text-left ${
          isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-gray-400'
        } ${selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}
      >
        {selectedValues.length === 0 ? placeholder : `${selectedValues.length} selected`}
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  readOnly
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {option.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown; 