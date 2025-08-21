# 📊 Sistema de Logging del Gaming Blog

## 🎯 **Descripción**
Sistema completo de logging implementado con Winston que registra todas las actividades importantes de la aplicación, incluyendo requests HTTP, operaciones de base de datos, autenticación y errores.

## 🚀 **Características**

### **Tipos de Logs:**
- 📝 **Combined**: Todos los logs combinados
- ❌ **Error**: Solo errores y excepciones
- 🌐 **Access**: Logs de acceso y requests HTTP
- 🔄 **Rotación automática**: Los archivos se rotan diariamente
- 📊 **Compresión**: Los logs antiguos se comprimen automáticamente

### **Niveles de Log:**
- 🔴 **ERROR**: Errores críticos que requieren atención inmediata
- 🟡 **WARN**: Advertencias que no son críticas pero importantes
- 🔵 **INFO**: Información general de la aplicación
- 🟢 **DEBUG**: Información detallada para desarrollo

## 📁 **Estructura de Archivos**

```
logs/
├── combined-2025-08-21.log    # Todos los logs del día
├── error-2025-08-21.log       # Solo errores del día
├── access-2025-08-21.log      # Logs de acceso del día
└── combined-2025-08-20.log.gz # Logs comprimidos de días anteriores
```

## 🛠️ **Uso**

### **1. Ver todos los archivos de log disponibles:**
```bash
node scripts/viewLogs.js
```

### **2. Ver el contenido de un log específico:**
```bash
node scripts/viewLogs.js combined-2025-08-21.log
```

### **3. Ver logs de errores:**
```bash
node scripts/viewLogs.js error-2025-08-21.log
```

### **4. Ver logs de acceso:**
```bash
node scripts/viewLogs.js access-2025-08-21.log
```

## 📊 **Información Registrada**

### **Requests HTTP:**
- Método HTTP (GET, POST, PUT, DELETE)
- URL solicitada
- Código de estado de respuesta
- Tiempo de respuesta
- IP del cliente
- User-Agent del navegador
- Tamaño de la respuesta

### **Operaciones de Base de Datos:**
- Tipo de operación (INSERT, SELECT, UPDATE, DELETE)
- Tabla afectada
- Detalles de la operación
- Errores si los hay
- Timestamp de la operación

### **Autenticación:**
- Intentos de login/registro
- Éxitos y fallos
- IP del usuario
- Timestamp

### **Operaciones CRUD:**
- Creación, lectura, actualización y eliminación de recursos
- ID del recurso afectado
- Usuario que realizó la operación
- Detalles de la operación

## ⚙️ **Configuración**

### **Variables de Entorno:**
```bash
NODE_ENV=development  # Nivel de logging (debug en desarrollo, info en producción)
```

### **Rotación de Logs:**
- **Frecuencia**: Diaria
- **Tamaño máximo**: 20MB por archivo
- **Retención**: 14 días
- **Compresión**: Automática para archivos antiguos

## 🔍 **Monitoreo en Tiempo Real**

### **En la consola del servidor:**
Los logs aparecen en tiempo real con colores:
- 🔴 **Rojo**: Errores
- 🟡 **Amarillo**: Advertencias
- 🔵 **Cyan**: Información
- 🟢 **Verde**: Debug

### **En los archivos:**
Los logs se guardan en formato JSON para fácil procesamiento:
```json
{
  "level": "info",
  "message": "HTTP Request",
  "method": "GET",
  "url": "/blog/1",
  "status": 200,
  "duration": "45ms",
  "timestamp": "2025-08-21T16:30:00.000Z"
}
```

## 🚨 **Alertas y Monitoreo**

### **Requests Lentos:**
- Se registran automáticamente requests que tomen más de 2 segundos
- Útil para identificar problemas de rendimiento

### **Errores Críticos:**
- Todos los errores 5xx se registran como ERROR
- Errores 4xx se registran como WARN
- Errores de base de datos se registran con stack trace completo

## 📈 **Análisis de Logs**

### **Herramientas Recomendadas:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana** para visualización
- **Scripts personalizados** para análisis específicos

### **Métricas Importantes:**
- Tiempo de respuesta promedio
- Tasa de errores
- Usuarios más activos
- Recursos más solicitados
- Patrones de uso

## 🔧 **Mantenimiento**

### **Limpieza Automática:**
- Los logs se limpian automáticamente después de 14 días
- Los archivos se comprimen para ahorrar espacio
- No se requiere intervención manual

### **Backup:**
- Los logs se pueden respaldar junto con la base de datos
- Útil para auditorías y análisis históricos

## 🎉 **Beneficios**

1. **🔍 Visibilidad completa** de la aplicación
2. **🐛 Debugging rápido** de problemas
3. **📊 Métricas de rendimiento** en tiempo real
4. **🛡️ Seguridad** mediante auditoría de acceso
5. **📈 Análisis de uso** para mejoras
6. **🚨 Alertas tempranas** de problemas

---

*Sistema de logging implementado con ❤️ para el Gaming Blog*
