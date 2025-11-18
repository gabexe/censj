# Con Eso No Se Jode - Juego Digital

Versión digital del juego de mesa de humor negro "Con Eso No Se Jode" con sistema multijugador completo.

## 🎮 Características

### Sistema Multijugador Completo
- **3-10 jugadores**: Configura partidas para 3 hasta 10 participantes
- **Sistema de turnos**: Los jugadores toman turnos para revelar y responder cartas
- **Tres tipos de cartas**:
  - **Individuales**: El jugador en turno decide si cumplir o pasar (botones ✓ y ✗)
  - **Grupales**: Todos participan y se selecciona un ganador (botón 💀)
  - **Especiales**: Cartas con mecánicas únicas como robar o acciones especiales (botón ✗)
- **Seguimiento de puntuación**: Cada carta cumplida suma un punto
- **Persistencia automática**: El juego guarda el progreso automáticamente

### Interfaz Brutalista y Gótica
- Diseño minimalista en blanco y negro
- Tipografía Oranienbaum para estética gótica
- Animaciones suaves y transiciones elegantes
- Panel de información desplegable desde la parte inferior
- Diseño responsive para móviles, tablets y desktop

### Mecánicas del Juego
1. **Configuración inicial**: 7 cartas por jugador en el mazo
2. **Turnos rotativos**: Los jugadores se turnan para revelar cartas
3. **Cartas individuales** (✓✗): 
   - CUMPLIR: Gana la carta (suma 1 punto)
   - PASAR: Descarta la carta (sin puntos)
4. **Cartas grupales** (💀): Todos participan, se selecciona manualmente al ganador
5. **Sistema de Robo** (🤚): 
   - Cualquier jugador puede gritar una palabra especial (ej: nombre del que lee)
   - El jugador que lee presiona el botón rojo de ROBO
   - Selecciona quién le robó la carta
   - El ladrón gana +1 punto, el que lee pierde -1 punto
6. **Mecánicas Especiales**: 7 cartas con comportamientos únicos
   - **CARTA PALA** (🤚 Tirar): Tirar celular, quien lo agarra pierde 1 punto, lector gana 1
   - **POBRE POLENTA** (☠️ Pierdo): Jugador con menos dinero pierde la partida automáticamente
   - **TENEMOS QUE HABLAR** (☠️ Pierdo): El lector pierde la partida inmediatamente
   - **TENGO ANSIEDAD** (⏳ Perder turno): El lector pierde su turno
   - **FETO INGENIERO** (⏳ Perder turno): El lector pierde su turno
   - **BUENA GENTE** (👤 Elegir perdedor): El grupo elige quién pierde la partida
   - **HOMBRE BLANCO HETEROSEXUAL** (🏆 Gano): El lector gana la partida automáticamente
7. **Victoria**: Gana quien tenga más cartas al final del mazo
8. **Scroll habilitado**: Desliza en cartas largas para leer todo el contenido
9. **Dimming effect**: Al abrir el panel de info, la carta se difumina para mejor legibilidad

### Modo Testing 🧪
Para probar todas las cartas del juego:
1. En la configuración, selecciona el número de jugadores que quieras (mínimo 3)
2. Nombra a **TODOS** los jugadores exactamente como "test" (minúsculas)
3. Haz clic en "INICIAR PARTIDA"
4. El juego activará automáticamente el modo testing
5. Las 114 cartas aparecerán en orden (sin barajar)
6. Verás un mensaje en la consola: "🧪 MODO TESTING ACTIVADO"
7. Permite verificar todas las mecánicas especiales

**Ejemplo de configuración:**
- Jugador 1: test
- Jugador 2: test
- Jugador 3: test

Ver [MECANICAS.md](MECANICAS.md) para documentación completa de cada mecánica.

## 🚀 Uso

### Iniciar el Juego
1. Abre `index.html` en tu navegador (se recomienda servidor local o GitHub Pages)
2. Confirma que eres mayor de 18 años
3. Configura el número de jugadores (3-10)
4. Ingresa los nombres de los jugadores
5. Haz clic en "INICIAR PARTIDA"

### Durante la Partida
- Las cartas se revelan automáticamente con animación palabra por palabra
- Usa los botones **CUMPLIR** / **PASAR** para cartas individuales
- Usa **SELECCIONAR GANADOR** para cartas grupales (todos participan)
- **Sistema de Robo**: Si alguien grita una palabra especial durante la lectura:
  1. Presiona el botón rojo 🤚 (ROBO)
  2. Selecciona quién te robó la carta
  3. Esa persona gana +1 punto y tú pierdes -1 punto
- Presiona **⌃ INFO** para ver el panel con:
  - Turno actual
  - Cartas restantes
  - Puntuaciones de todos los jugadores
- La partida se guarda automáticamente después de cada acción
- Puedes abandonar la partida en cualquier momento desde el panel

### Fin del Juego
- El juego termina cuando se acaban las cartas del mazo
- Se muestra el ranking completo ordenado por puntos
- El ganador se destaca visualmente
- En caso de empate, se muestran todos los ganadores
- Opción de jugar de nuevo

## 📝 Modificar Cartas

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
       ],
       "tipo": "individual",
       "mecanica": "normal"
     }
   ]
   ```
   
   **Tipos de carta disponibles:**
   - `"individual"`: Botones CUMPLIR (✓) y PASAR (✗)
   - `"grupal"`: Botón SELECCIONAR GANADOR (💀) y PASAR (✗)
   - `"especial"`: Para cartas con mecánicas únicas
   
   **Mecánicas disponibles:**
   - `"normal"`: Comportamiento estándar según el tipo
   - `"robo_automatico"`: CARTA PALA - tirar celular
   - `"pierde_turno"`: Saltar el turno del jugador
   - `"pierde_partida"`: Marcar como perdedor automático
   - `"seleccionar_perdedor"`: Grupo elige quién pierde
   - `"gana_partida"`: Marcar como ganador automático

3. **Agregar tipos automáticamente:**
   ```bash
   python add_tipos.py
   ```
   Este script analiza las cartas y asigna tipos automáticamente basándose en palabras clave.

4. **Cifrar:**
   ```bash
   python encrypt.py
   ```

**Nota:** El sistema ahora usa un campo explícito `tipo` en cada carta para determinar qué botones mostrar, eliminando la detección automática inconsistente.

## 🔒 Seguridad y Privacidad

- Las cartas están cifradas usando XOR + Base64
- El estado del juego se guarda cifrado en localStorage
- No se envían datos a ningún servidor externo
- Todo funciona offline una vez cargada la página

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome / Chromium (último)
- ✅ Firefox (último)
- ✅ Safari (último)
- ✅ Edge (último)

### Dispositivos
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Móvil (320px - 767px)

## 🛠️ Estructura Técnica

### Archivos Principales
```
censj/
├── index.html          # Estructura con todas las pantallas
├── main.js             # Lógica completa del juego multijugador
├── style.css           # Estilos brutalistas responsive
├── cartas.json         # Cartas cifradas del juego
├── cartas.decrypted.json  # Cartas en texto plano (no subir a git)
├── encrypt.py          # Script para cifrar cartas
├── decrypt.py          # Script para descifrar cartas
├── add_mecanicas.py    # Script para agregar campo mecanica
├── MECANICAS.md        # Documentación completa de mecánicas especiales
└── README.md           # Este archivo
```

### Estado del Juego (gameState)
```javascript
{
  fase: 'inicio' | 'configuracion' | 'jugando' | 'finalizado',
  jugadores: [{nombre: string, cartasGanadas: number}],
  turnoActual: number,
  mazoRestante: Array,
  cartaActual: Object,
  ganador: string
}
```

### Tipos de Cartas
El juego determina qué botones mostrar basándose en dos campos:
- **`tipo`**: Categoría general de la carta (`individual`, `grupal`, `especial`)
- **`mecanica`**: Comportamiento específico de la carta

**Cartas con `mecanica: "normal"` (107 cartas):**
- **`tipo: "individual"`**: Botones CUMPLIR (✓), PASAR (✗), ROBO (🤚)
- **`tipo: "grupal"`**: Botones SELECCIONAR GANADOR (💀), PASAR (✗), ROBO (🤚)
- **`tipo: "especial"`**: Solo botón PASAR (✗)

**Cartas con mecánicas especiales (7 cartas):**
- `robo_automatico`: Botón TIRAR (🤚 naranja) - CARTA PALA
- `pierde_turno`: Botón PERDER TURNO (⏳ rojo) - TENGO ANSIEDAD, FETO INGENIERO
- `pierde_partida`: Botón PIERDO (☠️ rojo) - POBRE POLENTA, TENEMOS QUE HABLAR
- `seleccionar_perdedor`: Botón ELEGIR PERDEDOR (👤 rojo) - BUENA GENTE
- `gana_partida`: Botón GANO (🏆 verde) - HOMBRE BLANCO HETEROSEXUAL

Cuando una carta tiene `mecanica != "normal"`, la mecánica anula el comportamiento del `tipo`.

## 🎨 Personalización

### Modificar Estilos
Todos los estilos están en `style.css` organizados por secciones:
- Variables y reset
- Pantallas (disclaimer, configuración, juego, victoria)
- Componentes (botones, panel, modal)
- Media queries responsive

### Ajustar Mecánicas
Edita `main.js` para modificar:
- Número de cartas por jugador (línea: `const cartasNecesarias = nombres.length * 7`)
- Lógica de tipos de carta (función `mostrarBotonesAccion`)
- Tiempo de espera antes de mostrar botones (función `siguienteTurno`)
- Implementar lógica para cartas especiales (función `procesarDecision`)

## 📋 Reglas del Juego Original

- Cada jugador, en su turno, toma una carta del mazo
- Si cumple la consigna, gana la carta (1 punto)
- Si no cumple, puede pasar (sin puntos)
- Cartas grupales: todos participan, el mejor/peor gana
- La partida termina cuando no quedan cartas
- Gana quien tenga más cartas
- En empate, se declara empate múltiple

## ⚠️ Advertencias

Este juego contiene contenido para adultos que puede ser:
- Explícito y fuerte
- Políticamente incorrecto
- Ofensivo o perturbador
- De humor negro y morboso

**Solo para mayores de 18 años.**

## 🐛 Solución de Problemas

### El juego no carga las cartas
- Asegúrate de usar un servidor web (no abrir directamente desde archivos)
- Usa `python -m http.server` o GitHub Pages

### La partida no se guarda
- Verifica que tu navegador permite localStorage
- No uses modo incógnito

### Los botones no aparecen
- Espera 3 segundos después de que aparece la carta
- Verifica que tienes JavaScript habilitado

## 📄 Licencia

Este proyecto es solo para uso personal y entretenimiento privado.

---

**Desarrollado con humor negro y código limpio** 🖤
