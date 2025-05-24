export function calculateTotal(amounts: string): number { // inputs a string and returns a number. Similar to soldiity return functions
    const amountArray = amounts
        .split(/[,\n]+/) // converts "100\n200, 300" into ["100", "200", "300"]
        .map(amt => amt.trim()) // trim whitespace ("  100 ") => ("100")
        .filter(amt => amt !== "") // removes any empty strings
        .map(amt => parseFloat(amt)) // converts string into a number via parse float
    if (amountArray.some(isNaN)) { // if still not a number, return 0
        return 0
    }
    return amountArray.reduce((acc, curr) => acc + curr, 0) // sum up values
}