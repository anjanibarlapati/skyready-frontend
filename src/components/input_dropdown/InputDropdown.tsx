import React, { useState, useRef, useEffect } from 'react';
import dropdown from '../assets/dropdown.png';
import './InputDropdown.css';

interface InputDropdownProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  options: string[];
  onChange?: (value: string) => void;
}

export const InputDropdown: React.FC<InputDropdownProps> = ({
  id,
  name,
  placeholder = '',
  value = '',
  options,
  onChange
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleInputClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setShowDropdown(false);
    if (onChange) {
      onChange(option);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="input-dropdown" style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <input
        type="text"
        id={id}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        onClick={handleInputClick}
        autoComplete="off"
        className="dropdown-input"
      />

      <span className="dropdown-icon" onClick={handleInputClick}>
        <img src={dropdown} alt="dropdown" id="dropdown" />
      </span>

      {showDropdown && options && options.length > 0 && (
        <div className={`dropdown-list ${showDropdown ? 'show' : 'hide'}`} id={`${id}-list`} data-testid={`${id}-list`}>
          {options
            .filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option, index) => (
              <div
                key={index}
                className="dropdown-item"
                data-value={option}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
