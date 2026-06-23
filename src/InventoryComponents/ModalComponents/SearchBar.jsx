import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search products..." }) => {
  return (
    <div className="inventory-search">
      <Search size={20} className="inventory-search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;