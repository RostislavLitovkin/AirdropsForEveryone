import { AirdropValue } from "../Interfaces/AirdropValue";

const apiUrl = "http://localhost:8000"

export async function fetchCsvContent(symbol: string): Promise<Record<string, AirdropValue>> {
    const response = await fetch(`${apiUrl}/claim-airdrop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symbol })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const csvContent = await response.text();
    console.log('CSV Content:', csvContent);

    // Convert the CSV content into a dictionary
    const rows = csvContent.split('\n');
    const dictionary: Record<string, AirdropValue> = {};

    for (let i = 0; i < rows.length; i++) { // Start at 1 if you want to skip header
        const [key, value] = rows[i].split(',');

        // Check if key and value exist before adding to dictionary
        if (key && value) {
            dictionary[key.trim()] = { amount: parseInt(value.trim()), index: i };
        }
    }

    console.log('Dictionary:', dictionary);
    return dictionary;
}
