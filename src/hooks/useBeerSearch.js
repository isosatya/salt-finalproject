import { useState, useEffect } from "react";
import axios from "../components/axios";

/**
 * Custom hook for beer search functionality
 * @param {string} searchTerm - Search term for beer names
 * @returns {Object} - { results, loading, error, search }
 */
function useBeerSearch(searchTerm = "") {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const searchBeers = async () => {
            if (!searchTerm.trim()) {
                setResults([]);
                setError("");
                return;
            }

            try {
                setLoading(true);
                setError("");
                
                const response = await axios.get(
                    `https://api.punkapi.com/v2/beers?beer_name=${searchTerm}&per_page=16`
                );
                
                if (response.data && response.data.length > 0) {
                    setResults(response.data);
                } else {
                    setError("Sorry Mate... didn't find the variety you lookin' for!");
                    setResults([]);
                }
            } catch (err) {
                setError("Search failed. Please try again.");
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search to avoid too many API calls
        const timeoutId = setTimeout(searchBeers, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return { results, loading, error };
}

export default useBeerSearch;
