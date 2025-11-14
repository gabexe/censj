# Con eso NO se jode

## Modificar cartas

1. **Descifrar cartas actuales:**
   ```bash
   python decrypt.py
   ```
   Esto crea `cartas.decrypted.json` con el contenido legible.

2. **Editar el archivo `cartas.decrypted.json`:**
   ```json
   [
     {
       "titulo": "TÍTULO DE LA CARTA",
       "descripcion": "Descripción opcional",
       "contenido": [
         "Opción 1",
         "Opción 2",
         "Opción 3"
       ]
     }
   ]
   ```

3. **Cifrar:**
   ```bash
   python encrypt.py
   ```

**Nota:** El juego no funcionará abriendo `index.html` directamente desde el sistema de archivos debido a restricciones de seguridad del navegador con `fetch()`.

## Estructura del proyecto

```
censj/
├── index.html          
├── style.css            
├── main.js             # Lógica del juego y descifrado
├── cartas.json         # Cartas cifradas (XOR + Base64)
├── encrypt.py          # Script para cifrar cartas
└── .nojekyll           # Necesario para GitHub Pages
```

## Sistema de cifrado

Las cartas están cifradas usando XOR cipher + Base64 para ofuscación básica del contenido en el repositorio público. La clave de descifrado está en el código JavaScript (`main.js`).
