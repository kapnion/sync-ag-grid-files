

const fs = require('fs').promises;
const path = require('path');
async function processAgGridLocale() {
    try {
        // Read the TypeScript file
        const tsFilePath = path.join(__dirname, 'agGridLocale.ts');
        const tsContent = await fs.readFile(tsFilePath, 'utf8');

        // Extract the AgGridLocale object
        const match = tsContent.match(/export const AgGridLocale = ({[\s\S]*?});/);
        if (!match) {
            throw new Error('AgGridLocale object not found in the TypeScript file');
        }

        const agGridLocaleStr = match[1];
        const agGridLocale = eval(`(${agGridLocaleStr})`);

        // Read the JSON file
        const jsonFilePath = path.join(__dirname, 'translations.json');
        let jsonContent = await fs.readFile(jsonFilePath, 'utf8');
        let translations = JSON.parse(jsonContent);

        // Process each property in AgGridLocale
        for (const [key, value] of Object.entries(agGridLocale)) {
            const jsonKey = `aggrid.${key}`;
            if (!(jsonKey in translations)) {
                translations[jsonKey] = value;
            }
        }

        // Write the updated translations back to the JSON file
        await fs.writeFile(jsonFilePath, JSON.stringify(translations, null, 2), 'utf8');

        console.log('Processing completed successfully');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

processAgGridLocale();