const fs = require('fs');
const path = require('path');

// Lista de archivos a excluir (incluyendo el propio script de build)
const excludeFiles = ['build.js'];

// Función para leer todos los archivos JS del directorio
function getAllJsFiles() {
    return fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.js') && !excludeFiles.includes(file))
        .map(file => path.join(__dirname, file));
}

// Función para leer y procesar cada archivo
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    return `\n// ================ ${fileName} ================\n${content}`;
}

// Función principal
function buildConsolidatedFile() {
    const files = getAllJsFiles();
    console.log('Archivos a consolidar:', files.map(f => path.basename(f)).join(', '));

    let consolidatedContent = '// Archivo consolidado generado automáticamente\n';
    consolidatedContent += '// Fecha de generación: ' + new Date().toISOString() + '\n';

    for (const file of files) {
        consolidatedContent += processFile(file);
    }

    const outputPath = path.join(__dirname);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(path.join(outputPath, 'all-in-one.js'), consolidatedContent);
    console.log('Archivo consolidado generado exitosamente en all-in-one.js');
}

buildConsolidatedFile();
