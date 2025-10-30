import { useState } from "react";

export default function SearchBar(props: any) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        props.onSearch(query.trim());
    };

    return (
        <div className="flex items-center gap-3 mb-5 bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-fit">
            <input
                type="text"
                placeholder="🔍 Search by JSON path (e.g., $.user.address.city)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none px-4 py-2 rounded-lg w-96 transition-all duration-200"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200 active:scale-95"
            >
                Search
            </button>
        </div>

    );
}
