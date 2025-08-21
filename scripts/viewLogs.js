#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');

function viewLogs() {
    console.log('📊 Sistema de Logs del Gaming Blog\n');
    
    if (!fs.existsSync(logDir)) {
        console.log('❌ No se encontró el directorio de logs');
        return;
    }
    
    const files = fs.readdirSync(logDir);
    
    if (files.length === 0) {
        console.log('📝 No hay archivos de log aún');
        return;
    }
    
    console.log('📁 Archivos de log disponibles:\n');
    
    files.forEach(file => {
        const filePath = path.join(logDir, file);
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(2);
        
        console.log(`📄 ${file}`);
        console.log(`   Tamaño: ${size} KB`);
        console.log(`   Última modificación: ${stats.mtime.toLocaleString()}`);
        console.log('');
    });
    
    console.log('💡 Para ver el contenido de un log específico:');
    console.log('   node scripts/viewLogs.js <nombre-del-archivo>');
    console.log('');
    console.log('🔍 Ejemplo: node scripts/viewLogs.js combined-2025-08-21.log');
}

function viewSpecificLog(filename) {
    const filePath = path.join(logDir, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ El archivo ${filename} no existe`);
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    
    console.log(`📖 Contenido de ${filename}:\n`);
    
    lines.forEach((line, index) => {
        if (line.trim()) {
            try {
                const logEntry = JSON.parse(line);
                const timestamp = logEntry.timestamp || 'N/A';
                const level = logEntry.level || 'INFO';
                const message = logEntry.message || 'N/A';
                
                // Color según el nivel
                let color = '\x1b[37m'; // Blanco por defecto
                switch (level.toUpperCase()) {
                    case 'ERROR': color = '\x1b[31m'; break; // Rojo
                    case 'WARN': color = '\x1b[33m'; break;  // Amarillo
                    case 'INFO': color = '\x1b[36m'; break;  // Cyan
                    case 'DEBUG': color = '\x1b[32m'; break; // Verde
                }
                
                console.log(`${color}[${timestamp}] [${level}]: ${message}\x1b[0m`);
                
                // Mostrar detalles adicionales si existen
                const details = { ...logEntry };
                delete details.timestamp;
                delete details.level;
                delete details.message;
                
                if (Object.keys(details).length > 0) {
                    console.log(`   📋 Detalles: ${JSON.stringify(details, null, 2)}`);
                }
                console.log('');
                
            } catch (e) {
                console.log(`📝 Línea ${index + 1}: ${line}`);
            }
        }
    });
}

// Ejecutar el script
const args = process.argv.slice(2);

if (args.length === 0) {
    viewLogs();
} else {
    viewSpecificLog(args[0]);
}
