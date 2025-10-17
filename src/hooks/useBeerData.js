import { useState, useEffect } from "react";
import axios from "../components/axios";

/**
 * Custom hook for fetching beer data from API
 * @param {number|string} beerId - ID of the beer to fetch
 * @returns {Object} - { beer, loading, error }
 */
function useBeerData(beerId) {
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!beerId) {
            setLoading(false);
            return;
        }

        const fetchBeer = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(`https://api.punkapi.com/v2/beers/${beerId}`);
                
                if (response.data && response.data.length > 0) {
                    const beerData = response.data[0];
                    
                    // Filter duplicate ingredients
                    if (beerData.ingredients) {
                        if (beerData.ingredients.hops) {
                            const uniqueHops = filterUniqueIngredients(beerData.ingredients.hops);
                            beerData.ingredients.hops = uniqueHops;
                        }
                        
                        if (beerData.ingredients.malt) {
                            const uniqueMalts = filterUniqueIngredients(beerData.ingredients.malt);
                            beerData.ingredients.malt = uniqueMalts;
                        }
                    }
                    
                    setBeer(beerData);
                } else {
                    setError("Beer not found");
                }
            } catch (err) {
                setError(err.message || "Failed to fetch beer data");
            } finally {
                setLoading(false);
            }
        };

        fetchBeer();
    }, [beerId]);

    return { beer, loading, error };
}

/**
 * Helper function to filter unique ingredients by name
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {Array} - Array of unique ingredients
 */
function filterUniqueIngredients(ingredients) {
    const uniqueMap = {};
    ingredients.forEach(ingredient => {
        if (ingredient.name && !uniqueMap[ingredient.name]) {
            uniqueMap[ingredient.name] = ingredient;
        }
    });
    return Object.values(uniqueMap);
}

export default useBeerData;
