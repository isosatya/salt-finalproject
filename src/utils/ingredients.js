// Utility function to remove duplicate ingredients by name
export function removeDuplicateIngredients(ingredients) {
    const uniqueIngredients = {};
    
    for (let i = 0; i < ingredients.length; i++) {
        uniqueIngredients[ingredients[i].name] = ingredients[i];
    }
    
    return Object.values(uniqueIngredients);
}

// Filter hops and malts to remove duplicates
export function filterBeerIngredients(beerData) {
    if (!beerData.ingredients) {
        return beerData;
    }
    
    const filteredData = { ...beerData };
    
    if (beerData.ingredients.hops) {
        filteredData.ingredients.hops = removeDuplicateIngredients(beerData.ingredients.hops);
    }
    
    if (beerData.ingredients.malt) {
        filteredData.ingredients.malt = removeDuplicateIngredients(beerData.ingredients.malt);
    }
    
    return filteredData;
}
