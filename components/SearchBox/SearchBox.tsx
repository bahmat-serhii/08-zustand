import React, { type ChangeEvent, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  /** Controlled value of the input */
  value: string;
  /** Callback triggered when the debounced search text changes */
  onSearch: (searchText: string) => void;
  /** Callback for updating the input value */
  onChange: (newValue: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onSearch, onChange }) => {
  // Debounced version of the input value
  const [debouncedValue] = useDebounce(value, 500);

  // Call onSearch when the debounced value changes
  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  // Handle input changes and notify parent
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default SearchBox;
