import { useState, useEffect } from "react";
import axios from "../components/axios";

/**
 * Custom hook for fetching random beers
 * @param {number} count - Number of random beers to fetch
 * @returns {Object} - { beers, loading, error, refetch }
 */
function useRandomBeers(count = 8) {
    const [beers, setBeers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRandomBeers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Create array of promises for random beer requests
            const promises = Array.from({ length: count }, () =>
                axios.get("https://api.punkapi.com/v2/beers/random")
            );
            
            const responses = await Promise.all(promises);
            const beerData = responses.map(response => response.data[0]);
            
            setBeers(beerData);
        } catch (err) {
            setError(err.message || "Failed to fetch random beers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomBeers();
    }, [count]);

    return { beers, loading, error, refetch: fetchRandomBeers };
}

export default useRandomBeers;
