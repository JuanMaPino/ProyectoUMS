import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        onSearch(newQuery); // Llama a onSearch cada vez que se cambia el input
    };

    return (
        <div className="relative text-gray-600 ">
            <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={handleInputChange}
                className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-indigo-300 shadow-inner"
            />
            <button type="button" onClick={() => onSearch(query)} className="absolute right-0 top-0 mt-2 mr-4">
                <BiSearch className="text-xl" />
            </button>
        </div>
    );
};

export default SearchBar;
