const fs = require('fs');
const path = require('path');

// Lista de archivos a excluir (incluyendo el propio script de build y el archivo consolidado)
const excludeFiles = ['build.js', 'all-in-one.js'];

// Función para leer todos los archivos JS del directorio src
function getAllJsFiles() {
    const srcDir = path.join(__dirname, 'src');
    return fs.readdirSync(srcDir)
        .filter(file => file.endsWith('.js') && !excludeFiles.includes(file))
        .sort()
        .map(file => path.join(srcDir, file));
}

// Función para procesar las constantes en un archivo
function processConstants(content) {
    // Buscar y reemplazar definiciones de constantes globales con namespace
    const constantRegex = /(?:const|let|var)\s+([A-Z_][A-Z0-9_]*)\s*=\s*([^;]+);/g;
    let match;
    const constants = [];
    
    // Recolectar todas las constantes
    while ((match = constantRegex.exec(content)) !== null) {
        constants.push({
            name: match[1],
            value: match[2].trim(),
            fullMatch: match[0]
        });
    }
    
    // Reemplazar definiciones de constantes con referencias al namespace
    let processedContent = content;
    constants.forEach(constant => {
        // Reemplazar la definición de la constante
        processedContent = processedContent.replace(
            constant.fullMatch,
            `// Constante ${constant.name} movida al namespace CONSTANTS
// ${constant.fullMatch}`
        );
        
        // Reemplazar los usos de la constante
        const usageRegex = new RegExp(`\\b${constant.name}\\b(?!\\s*=)`, 'g');
        processedContent = processedContent.replace(usageRegex, `CONSTANTS.${constant.name}`);
    });
    
    return { 
        processedContent, 
        constants 
    };
}

// Función para leer y procesar cada archivo
function processFile(filePath, allConstants) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Procesar constantes
    const { processedContent, constants } = processConstants(content);
    
    // Agregar las constantes al objeto allConstants
    constants.forEach(constant => {
        allConstants[constant.name] = constant.value;
    });
    
    // Crear el contenido procesado con un comentario de separación
    return `\n// ================ ${fileName} ================\n${processedContent}`;
}

// Función principal
function buildConsolidatedFile() {
    const files = getAllJsFiles();
    console.log('Archivos a consolidar:', files.map(f => path.basename(f)).join(', '));

    // Objeto para almacenar todas las constantes
    const allConstants = {};

    // Header sin timestamp: el build debe ser determinista (CI hace git diff --exit-code)
    let consolidatedContent = '// Archivo consolidado generado automáticamente\n';
    consolidatedContent += '// No editar a mano: npm run build\n\n';

    // Agregar el namespace CONSTANTS al inicio
    consolidatedContent += '// Namespace para constantes compartidas\n';
    consolidatedContent += 'var CONSTANTS = {};\n';

    // Primero recolectar todas las constantes
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const { constants } = processConstants(content);
        constants.forEach(constant => {
            allConstants[constant.name] = constant.value;
        });
    }
    
    // Agregar las constantes al namespace
    consolidatedContent += '\n// Inicializar constantes compartidas\n';
    for (const name in allConstants) {
        consolidatedContent += `CONSTANTS.${name} = ${allConstants[name]};\n`;
    }

    // Luego procesar cada archivo
    for (const file of files) {
        consolidatedContent += processFile(file, allConstants);
    }

    const outputPath = path.join(__dirname);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(path.join(outputPath, 'all-in-one.js'), consolidatedContent);
    console.log('Archivo consolidado generado exitosamente en all-in-one.js');
}

/**
 * Publica data/cedears.json como API estática en GitHub Pages.
 * Formato con metadata para agentes/scripts (no es el array crudo de data/).
 */
function publishCedearsApi() {
    const srcPath = path.join(__dirname, 'data', 'cedears.json');
    const destDir = path.join(__dirname, 'docs', 'api');
    const destPath = path.join(destDir, 'cedears.json');

    if (!fs.existsSync(srcPath)) {
        throw new Error('No se encontró data/cedears.json');
    }

    const items = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
    if (!Array.isArray(items)) {
        throw new Error('data/cedears.json debe ser un array');
    }

    const payload = {
        schema_version: 1,
        name: 'cedears',
        description:
            'Listado de CEDEARs (BYMA) con nombre y ratio de conversión. ' +
            'Alternativa práctica al PDF de BYMA para agentes, scripts y planillas.',
        homepage: 'https://ferminrp.github.io/google-sheets-argento/#api',
        endpoint: 'https://ferminrp.github.io/google-sheets-argento/api/cedears.json',
        source_repo: 'https://github.com/ferminrp/google-sheets-argento',
        source_file: 'data/cedears.json',
        fields: {
            Cedears: 'Ticker del CEDEAR en BYMA',
            Name: 'Nombre de la empresa / instrumento subyacente',
            Market: 'Mercado donde cotiza el subyacente (ej. NYSE, NASDAQ, B3)',
            Ratio:
                "String de conversión. Formato 'N' (ej. \"20\") = N CEDEARs por 1 acción; " +
                "formato 'A:B' (ej. \"1:3\") = razón A:B. No se normaliza.",
            TickerOriginal:
                'Ticker del instrumento subyacente en su mercado de origen (puede diferir del ticker BYMA)',
        },
        count: items.length,
        items: items,
    };

    fs.mkdirSync(destDir, { recursive: true });
    // JSON estable (2 espacios + newline final) para git diff --exit-code en CI
    fs.writeFileSync(destPath, JSON.stringify(payload, null, 2) + '\n');
    console.log(
        `API CEDEARs publicada en docs/api/cedears.json (${items.length} items)`
    );
}

buildConsolidatedFile();
publishCedearsApi();
