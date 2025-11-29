# Diagnóstico del Formulario de Registro

## ¿Qué verificar?

### 1. En el Navegador (Chrome/Firefox)
1. Abre http://localhost:3000/login
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Llena el formulario:
   - Email: test@test.com
   - Contraseña: password123
   - Nombre: Test
4. Abre DevTools (F12) → Pestaña "Console"
5. Haz clic en "Crear cuenta"

**¿Qué ves en la consola?**
- ¿Hay errores rojos?
- ¿Aparece algún request a /api/auth/register?

### 2. En la Pestaña Network
1. DevTools → Pestaña "Network"
2. Filtra por "Fetch/XHR"
3. Haz clic en "Crear cuenta"
4. Busca el request a "register"

**Si aparece el request:**
- ¿Qué status code tiene? (200, 400, 500?)
- Haz clic en el request → Response tab
- ¿Qué dice la respuesta?

### 3. Errores Comunes

#### Si no pasa nada al hacer clic:
- JavaScript bloqueado
- Error en el código del formulario
- Event listener no conectado

#### Si muestra error de CORS:
- Problema con las cabeceras
- Puerto incorrecto

#### Si muestra 500:
- Error en el servidor
- Checa la terminal donde corre `npm run dev`

#### Si muestra 400:
- Validación falló
- Email ya existe
- Contraseña muy corta

## Solución Rápida

Si nada funciona, reinicia el servidor:

```bash
# Matar proceso actual
taskkill /F /PID 18996

# Iniciar de nuevo
npm run dev
```

Luego intenta registrarte de nuevo.
