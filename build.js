const fs = require('fs');
const path = require('path');

// Lista de archivos a excluir (incluyendo el propio script de build y el archivo consolidado)
const excludeFiles = ['build.js', 'all-in-one.js'];

// Función para leer todos los archivos JS del directorio src
function getAllJsFiles() {
    const srcDir = path.join(__dirname, 'src');
    return fs.readdirSync(srcDir)
        .filter(file => file.endsWith('.js') && !excludeFiles.includes(file))
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

    let consolidatedContent = '// Archivo consolidado generado automáticamente\n';
    consolidatedContent += '// Fecha de generación: ' + new Date().toISOString() + '\n\n';
    
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

buildConsolidatedFile();
