let cartas = [];
let cartasRestantes = [];

// Clave de descifrado (debe coincidir con encrypt_cartas.py)
const KEY = "CON_ESO_NO_SE_JODE_2025";

// Estado del juego
const gameState = {
  fase: 'inicio', // 'inicio', 'configuracion', 'jugando', 'finalizado'
  jugadores: [],
  turnoActual: 0,
  mazoRestante: [],
  cartaActual: null,
  ganador: null
};

// Función para guardar estado en localStorage
function guardarEstado() {
  try {
    const estadoCifrado = xorEncrypt(JSON.stringify(gameState), KEY);
    localStorage.setItem('censj_game_state', estadoCifrado);
  } catch (error) {
    console.error('Error al guardar estado:', error);
  }
}

// Función para cargar estado desde localStorage
function cargarEstado() {
  try {
    const estadoCifrado = localStorage.getItem('censj_game_state');
    if (estadoCifrado) {
      const estadoJson = xorDecrypt(estadoCifrado, KEY);
      const estadoCargado = JSON.parse(estadoJson);
      Object.assign(gameState, estadoCargado);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al cargar estado:', error);
    return false;
  }
}

// Función para limpiar estado guardado
function limpiarEstado() {
  localStorage.removeItem('censj_game_state');
  gameState.fase = 'inicio';
  gameState.jugadores = [];
  gameState.turnoActual = 0;
  gameState.mazoRestante = [];
  gameState.cartaActual = null;
  gameState.ganador = null;
}

// Función XOR para cifrar
function xorEncrypt(text, key) {
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);
  const encryptedBytes = new Uint8Array(textBytes.length);
  
  for (let i = 0; i < textBytes.length; i++) {
    encryptedBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  // Convertir a Base64
  let binaryString = '';
  for (let i = 0; i < encryptedBytes.length; i++) {
    binaryString += String.fromCharCode(encryptedBytes[i]);
  }
  return btoa(binaryString);
}

function xorDecrypt(encryptedBase64, key) {
  // Decodificar Base64
  const encryptedStr = atob(encryptedBase64);
  const encryptedBytes = new Uint8Array(encryptedStr.length);
  for (let i = 0; i < encryptedStr.length; i++) {
    encryptedBytes[i] = encryptedStr.charCodeAt(i);
  }
  
  // XOR decrypt
  const keyBytes = new TextEncoder().encode(key);
  const decryptedBytes = new Uint8Array(encryptedBytes.length);
  
  for (let i = 0; i < encryptedBytes.length; i++) {
    decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  // Convertir a string
  return new TextDecoder().decode(decryptedBytes);
}

async function cargarCartas() {
  try {
    const response = await fetch('cartas.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar cartas.json');
    }
    
    const encryptedData = await response.json();
    
    // Si el archivo está cifrado (tiene propiedad "data")
    if (encryptedData.data) {
      const decryptedString = xorDecrypt(encryptedData.data, KEY);
      cartas = JSON.parse(decryptedString);
    } else {
      // Si no está cifrado, usar directamente
      cartas = encryptedData;
    }
    
    cartasRestantes = [...cartas];
    return true;
  } catch (error) {
    console.error('Error al cargar cartas:', error);
    mostrarError('No se pudieron cargar las cartas.');
    return false;
  }
}

function mostrarError(mensaje) {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = `<div class="card">${mensaje}</div>`;
}

function cartaAleatoria() {
  if (cartasRestantes.length === 0) {
    return null;
  }
  const indice = Math.floor(Math.random() * cartasRestantes.length);
  return cartasRestantes.splice(indice, 1)[0];
}

function animarPalabrasPorPalabra(element, text, delay = 50, startDelay = 2000) {
  const words = text.split(' ');
  element.innerHTML = '';
  
  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.textContent = word;
    wordSpan.style.animationDelay = `${startDelay + (index * delay)}ms`;
    element.appendChild(wordSpan);
  });
}

function mostrarCarta(carta) {
  const cardContainer = document.getElementById('card-container');
  
  // Aplicar fadeout a la carta actual si existe
  const currentCard = cardContainer.querySelector('.card');
  if (currentCard) {
    currentCard.classList.add('fade-out');
    setTimeout(() => {
      cardContainer.innerHTML = '';
      renderizarNuevaCarta(carta, cardContainer);
    }, 500);
  } else {
    cardContainer.innerHTML = '';
    renderizarNuevaCarta(carta, cardContainer);
  }
}

function renderizarNuevaCarta(carta, cardContainer) {
  if (!carta) {
    const endScreen = document.createElement('div');
    endScreen.className = 'card end-screen';
    
    const restartBtn = document.createElement('button');
    restartBtn.id = 'restart-btn';
    restartBtn.setAttribute('aria-label', 'Reiniciar juego');
    restartBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
    `;
    restartBtn.onclick = () => {
      location.reload();
    };
    
    endScreen.appendChild(restartBtn);
    cardContainer.appendChild(endScreen);
    return;
  }
  
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  
  const titulo = document.createElement('div');
  titulo.className = 'card-title';
  titulo.textContent = carta.titulo || '';
  cardElement.appendChild(titulo);
  
  if (carta.descripcion && carta.descripcion.trim()) {
    const descripcion = document.createElement('div');
    descripcion.className = 'card-description';
    descripcion.textContent = carta.descripcion;
    cardElement.appendChild(descripcion);
  }
  
  if (carta.contenido && Array.isArray(carta.contenido)) {
    const contenido = document.createElement('div');
    contenido.className = 'card-content';
    
    let cumulativeDelay = 2000;
    carta.contenido.forEach((item, itemIndex) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'card-content-item';
      
      animarPalabrasPorPalabra(itemDiv, item, 50, cumulativeDelay);
      
      const wordCount = item.split(' ').length;
      cumulativeDelay += (wordCount * 50) + 200;
      
      contenido.appendChild(itemDiv);
    });
    
    cardElement.appendChild(contenido);
  }
  
  cardContainer.appendChild(cardElement);
}

// Funciones para el sistema de juego multijugador

function mostrarConfiguracion() {
  document.getElementById('config-screen').style.display = 'flex';
  gameState.fase = 'configuracion';
}

function generarCamposNombres(numPlayers) {
  const container = document.getElementById('players-names-container');
  container.innerHTML = '';
  
  for (let i = 0; i < numPlayers; i++) {
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `player-name-${i}`;
    input.placeholder = `Jugador ${i + 1}`;
    input.maxLength = 20;
    
    div.appendChild(input);
    container.appendChild(div);
  }
}

function mostrarErrorConfig(mensaje) {
  const errorEl = document.getElementById('config-error');
  errorEl.textContent = mensaje;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 3000);
}

function inicializarJuego(nombres) {
  // Crear jugadores
  gameState.jugadores = nombres.map(nombre => ({
    nombre: nombre,
    cartasGanadas: 0
  }));
  
  // Detectar modo testing: todos los jugadores se llaman "test" (case-insensitive)
  const modoTesting = nombres.every(nombre => nombre.trim().toLowerCase() === 'test');
  gameState.modoTesting = modoTesting;
  
  // Log para debugging
  if (modoTesting) {
    console.log('🧪 MODO TESTING ACTIVADO - Todas las cartas disponibles:', cartas.length);
  }
  
  // Calcular cartas para el mazo
  let cartasParaMazo;
  if (modoTesting) {
    // Modo testing: usar TODAS las cartas en orden
    cartasParaMazo = [...cartas];
  } else {
    // Modo normal: 7 cartas por jugador, barajadas
    const cartasNecesarias = nombres.length * 7;
    const cartasBarajadas = [...cartas].sort(() => Math.random() - 0.5);
    cartasParaMazo = cartasBarajadas.slice(0, cartasNecesarias);
  }
  
  gameState.mazoRestante = cartasParaMazo;
  
  console.log('Cartas en el mazo:', gameState.mazoRestante.length);
  
  // Inicializar turno
  gameState.turnoActual = 0;
  gameState.fase = 'jugando';
  
  // Guardar estado
  guardarEstado();
  
  // Ocultar configuración y mostrar juego
  document.getElementById('config-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';
  const toggleBtn = document.getElementById('toggle-panel-btn');
  toggleBtn.style.display = 'flex';
  
  // Actualizar UI
  actualizarUI();
  
  // Mostrar primera carta
  siguienteTurno();
}

function restaurarPartida() {
  // Mostrar pantalla de juego
  document.getElementById('game-screen').style.display = 'flex';
  const toggleBtn = document.getElementById('toggle-panel-btn');
  toggleBtn.style.display = 'flex';
  
  // Restaurar mazo
  cartasRestantes = [...gameState.mazoRestante];
  
  // Actualizar UI
  actualizarUI();
  
  // Mostrar carta actual o siguiente
  if (gameState.cartaActual) {
    mostrarCarta(gameState.cartaActual);
    mostrarBotonesAccion(gameState.cartaActual);
  } else {
    siguienteTurno();
  }
}

function actualizarUI() {
  // Actualizar turno actual
  const jugadorActual = gameState.jugadores[gameState.turnoActual];
  document.getElementById('current-turn-display').textContent = jugadorActual.nombre;
  
  // Actualizar cartas restantes
  document.getElementById('cards-remaining-display').textContent = gameState.mazoRestante.length;
  
  // Actualizar scoreboard
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = '';
  
  gameState.jugadores.forEach((jugador, index) => {
    const div = document.createElement('div');
    div.className = 'score-item';
    if (index === gameState.turnoActual) {
      div.classList.add('active-player');
    }
    
    const nombre = document.createElement('span');
    nombre.className = 'player-name';
    nombre.textContent = jugador.nombre;
    
    const puntos = document.createElement('span');
    puntos.className = 'player-score';
    puntos.textContent = jugador.cartasGanadas;
    
    div.appendChild(nombre);
    div.appendChild(puntos);
    scoreboard.appendChild(div);
  });
}

function siguienteTurno() {
  // Verificar si hay cartas restantes
  if (gameState.mazoRestante.length === 0) {
    finalizarJuego();
    return;
  }
  
  // Obtener siguiente carta
  const indiceCarta = Math.floor(Math.random() * gameState.mazoRestante.length);
  const carta = gameState.mazoRestante.splice(indiceCarta, 1)[0];
  
  gameState.cartaActual = carta;
  guardarEstado();
  
  // Mostrar carta
  mostrarCarta(carta);
  
  // Actualizar UI
  actualizarUI();
  
  // Mostrar botones de acción después de que se muestre la carta
  setTimeout(() => {
    mostrarBotonesAccion(carta);
  }, 3000); // Esperar a que termine la animación de la carta
}

function mostrarBotonesAccion(carta) {
  const actionButtons = document.getElementById('action-buttons');
  
  // Obtener todos los botones
  const aceptarBtn = document.getElementById('aceptar-btn');
  const rechazarBtn = document.getElementById('rechazar-btn');
  const seleccionarGanadorBtn = document.getElementById('seleccionar-ganador-btn');
  const seleccionarPerdedorBtn = document.getElementById('seleccionar-perdedor-btn');
  const roboBtn = document.getElementById('robo-btn');
  const tirarCelularBtn = document.getElementById('tirar-celular-btn');
  const robarTodasBtn = document.getElementById('robar-todas-btn');
  const apuestaBtn = document.getElementById('apuesta-btn');
  
  // Ocultar todos los botones inicialmente
  [aceptarBtn, rechazarBtn, seleccionarGanadorBtn, seleccionarPerdedorBtn, roboBtn,
   tirarCelularBtn, robarTodasBtn, apuestaBtn].forEach(btn => {
    if (btn) btn.style.display = 'none';
  });
  
  // Determinar qué botones mostrar según la mecánica
  const mecanica = carta.mecanica || 'normal';
  
  switch(mecanica) {
    case 'normal':
      // Por defecto: rechazar + seleccionar ganador
      rechazarBtn.style.display = 'block';
      seleccionarGanadorBtn.style.display = 'block';
      break;
      
    case 'robo_automatico':
      // CARTA PALA: tirar celular
      tirarCelularBtn.style.display = 'block';
      break;
      
    case 'aceptar_rechazar':
      // REXANO, CARTA MUFA, EL SILENCIO, LA VERDAD O RETO, TRADUCTOR DE SEÑAS
      aceptarBtn.style.display = 'block';
      rechazarBtn.style.display = 'block';
      break;
      
    case 'aceptar_rechazar_pierde_turno':
      // SUPER ARIO BROS: aceptar (gana punto) o rechazar (pierde turno)
      aceptarBtn.style.display = 'block';
      rechazarBtn.style.display = 'block';
      break;
      
    case 'apuesta':
      // LUDOPATÍA, MUÑÓN PRÓTESIS: botón apuesta
      apuestaBtn.style.display = 'block';
      break;
      
    case 'seleccionar_ganador':
      // MARADONA: solo seleccionar ganador
      seleccionarGanadorBtn.style.display = 'block';
      break;
      
    case 'seleccionar_ganador_turno_extra':
      // CUPON NEGRO, MIL MANERAS DE MORIR: seleccionar ganador (lector gana turno extra)
      seleccionarGanadorBtn.style.display = 'block';
      break;
      
    case 'seleccionar_perdedor_turno':
      // CARTRUMP: seleccionar quién pierde turno
      seleccionarPerdedorBtn.style.display = 'block';
      break;
      
    case 'seleccionar_perdedor_partida':
      // POBRE POLENTA, BUENA GENTE: seleccionar quién pierde partida
      seleccionarPerdedorBtn.style.display = 'block';
      break;
      
    case 'pierde_turno':
      // TENGO ANSIEDAD, FETO INGENIERO: rechazar (automático)
      rechazarBtn.style.display = 'block';
      break;
      
    case 'pierde_partida':
      // TENEMOS QUE HABLAR: rechazar (automático)
      rechazarBtn.style.display = 'block';
      break;
      
    case 'gana_partida':
      // HOMBRE BLANCO HETEROSEXUAL: aceptar (automático)
      aceptarBtn.style.display = 'block';
      break;
      
    case 'adivinar_robo':
      // EL PIBE TIGRE: aceptar (acertó) o rechazar (falló)
      aceptarBtn.style.display = 'block';
      rechazarBtn.style.display = 'block';
      break;
      
    case 'rechazar_robar_todas':
      // CARTA DENGUE: rechazar o robar todas
      rechazarBtn.style.display = 'block';
      robarTodasBtn.style.display = 'block';
      break;
  }
  
  actionButtons.style.display = 'flex';
}

function procesarDecision(accion) {
  // Ocultar botones
  document.getElementById('action-buttons').style.display = 'none';
  
  if (accion === 'cumplir') {
    // Dar punto al jugador actual
    gameState.jugadores[gameState.turnoActual].cartasGanadas++;
  }
  
  // En ambos casos (cumplir/pasar), pasar al siguiente turno
  gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  gameState.cartaActual = null;
  guardarEstado();
  
  // Siguiente turno
}

function cerrarModalGanador() {
  const modal = document.getElementById('winner-modal');
  modal.style.display = 'none';
}

function seleccionarGanadorGrupal(indiceJugador) {
  // Ocultar modal
  cerrarModalGanador();
  document.getElementById('action-buttons').style.display = 'none';
  
  // Dar punto al jugador seleccionado
}

function cerrarModalGanador() {
  const modal = document.getElementById('winner-modal');
  modal.style.display = 'none';
}

function mostrarSeleccionLadron() {
  const modal = document.getElementById('robo-modal');
  const backdrop = modal.querySelector('.modal-backdrop');
  const selectionDiv = document.getElementById('robo-selection');
  
  selectionDiv.innerHTML = '';
  
  // Mostrar todos los jugadores EXCEPTO el actual
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = jugador.nombre;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        procesarRobo(index);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  // Cerrar modal al hacer click en el backdrop
  backdrop.addEventListener('click', cerrarModalRobo);
  
  modal.style.display = 'flex';
}

function cerrarModalRobo() {
  const modal = document.getElementById('robo-modal');
  modal.style.display = 'none';
}

function procesarRobo(indiceLadron) {
  // Ocultar modal y botones
  cerrarModalRobo();
  document.getElementById('action-buttons').style.display = 'none';
  
  const jugadorActual = gameState.turnoActual;
  
  // Restar punto al jugador actual (mínimo 0)
  if (gameState.jugadores[jugadorActual].cartasGanadas > 0) {
    gameState.jugadores[jugadorActual].cartasGanadas--;
  }
  
  // Sumar punto al ladrón
  gameState.jugadores[indiceLadron].cartasGanadas++;
  
  // Pasar al siguiente turno
  gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  gameState.cartaActual = null;
  guardarEstado();
  
  // Siguiente turno
  siguienteTurno();
}

function finalizarJuego() {
  gameState.fase = 'finalizado';
  
  // Calcular ganador(es)
  const maxPuntos = Math.max(...gameState.jugadores.map(j => j.cartasGanadas));
  const ganadores = gameState.jugadores.filter(j => j.cartasGanadas === maxPuntos);
  gameState.ganador = ganadores.length === 1 ? ganadores[0].nombre : 'Empate';
  
  guardarEstado();
  
  // Ocultar juego y panel
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('toggle-panel-btn').style.display = 'none';
  document.getElementById('info-panel').classList.remove('panel-open');
  
  // Mostrar pantalla de victoria
  mostrarVictoria(ganadores);
}

function mostrarVictoria(ganadores) {
  const victoryScreen = document.getElementById('victory-screen');
  const rankingContainer = document.getElementById('ranking-container');
  
  // Ordenar jugadores por puntos
  const jugadoresOrdenados = [...gameState.jugadores].sort((a, b) => b.cartasGanadas - a.cartasGanadas);
  
  rankingContainer.innerHTML = '';
  
  // Título de ganadores
  if (ganadores.length > 1) {
    const empateDiv = document.createElement('div');
    empateDiv.className = 'empate-message';
    empateDiv.textContent = `EMPATE - ${ganadores.length} Ganadores`;
    rankingContainer.appendChild(empateDiv);
  }
  
  // Ranking
  jugadoresOrdenados.forEach((jugador, index) => {
    const div = document.createElement('div');
    div.className = 'ranking-item';
    
    const esGanador = ganadores.some(g => g.nombre === jugador.nombre);
    if (esGanador) {
      div.classList.add('winner');
    }
    
    const posicion = document.createElement('span');
    posicion.className = 'ranking-position';
    posicion.textContent = `${index + 1}.`;
    
    const nombre = document.createElement('span');
    nombre.className = 'ranking-name';
    nombre.textContent = jugador.nombre;
    
    const puntos = document.createElement('span');
    puntos.className = 'ranking-score';
    puntos.textContent = `${jugador.cartasGanadas} cartas`;
    
    div.appendChild(posicion);
    div.appendChild(nombre);
    div.appendChild(puntos);
    rankingContainer.appendChild(div);
  });
  
  victoryScreen.style.display = 'flex';
}

// ============================================
// FUNCIONES PARA MECÁNICAS ESPECIALES
// ============================================

// CARTA PALA: Robo automático
function procesarTirarCelular() {
  const modal = document.getElementById('robo-auto-modal');
  const backdrop = modal.querySelector('.modal-backdrop');
  const selectionDiv = document.getElementById('robo-auto-selection');
  
  selectionDiv.innerHTML = '';
  
  // Mostrar todos los jugadores EXCEPTO el actual
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = jugador.nombre;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        aplicarRoboAutomatico(index);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  backdrop.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  modal.style.display = 'flex';
}

function aplicarRoboAutomatico(indiceLadron) {
  // Cerrar modal
  document.getElementById('robo-auto-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  const jugadorActual = gameState.jugadores[gameState.turnoActual];
  const ladron = gameState.jugadores[indiceLadron];
  
  // El ladrón pierde 1 punto (mínimo 0)
  if (ladron.cartasGanadas > 0) {
    ladron.cartasGanadas--;
  }
  
  // El jugador actual gana 1 punto
  jugadorActual.cartasGanadas++;
  
  // Avanzar turno
  gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  gameState.cartaActual = null;
  guardarEstado();
  
  siguienteTurno();
}

// PIERDE TURNO: Saltar turno del jugador actual
// ============================================
// FUNCIONES PARA MECÁNICAS
// ============================================

function procesarAceptar() {
  document.getElementById('action-buttons').style.display = 'none';
  const carta = gameState.cartaActual;
  const mecanica = carta.mecanica || 'normal';
  
  switch(mecanica) {
    case 'aceptar_rechazar':
    case 'adivinar_robo':
      // Gana la carta
      gameState.jugadores[gameState.turnoActual].cartasGanadas++;
      if (mecanica === 'adivinar_robo') {
        // EL PIBE TIGRE: acertó, gana carta + roba 1
        mostrarSeleccionRoboExtra();
        return;
      }
      avanzarTurno();
      break;
      
    case 'aceptar_rechazar_pierde_turno':
      // SUPER ARIO BROS: gana punto
      gameState.jugadores[gameState.turnoActual].cartasGanadas++;
      avanzarTurno();
      break;
      
    case 'gana_partida':
      // HOMBRE BLANCO: gana partida
      gameState.jugadores[gameState.turnoActual].cartasGanadas = 9999;
      gameState.jugadores[gameState.turnoActual].ganador = true;
      avanzarTurno();
      break;
  }
}

function procesarRechazar() {
  document.getElementById('action-buttons').style.display = 'none';
  const carta = gameState.cartaActual;
  const mecanica = carta.mecanica || 'normal';
  
  switch(mecanica) {
    case 'normal':
      // Simplemente pasa sin dar puntos
      avanzarTurno();
      break;
      
    case 'aceptar_rechazar':
      // No gana la carta
      avanzarTurno();
      break;
      
    case 'aceptar_rechazar_pierde_turno':
      // SUPER ARIO BROS: pierde turno
      gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
      avanzarTurno();
      break;
      
    case 'pierde_turno':
      // TENGO ANSIEDAD, FETO INGENIERO
      gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
      avanzarTurno();
      break;
      
    case 'pierde_partida':
      // TENEMOS QUE HABLAR
      gameState.jugadores[gameState.turnoActual].cartasGanadas = -9999;
      gameState.jugadores[gameState.turnoActual].perdedor = true;
      avanzarTurno();
      break;
      
    case 'adivinar_robo':
      // EL PIBE TIGRE: no acertó, pierde carta
      if (gameState.jugadores[gameState.turnoActual].cartasGanadas > 0) {
        gameState.jugadores[gameState.turnoActual].cartasGanadas--;
      }
      // Mostrar selección de quién gana 2 puntos
      mostrarSeleccionGanadorPuntos(2);
      break;
      
    case 'rechazar_robar_todas':
      // CARTA DENGUE: pierde partida
      gameState.jugadores[gameState.turnoActual].cartasGanadas = -9999;
      gameState.jugadores[gameState.turnoActual].perdedor = true;
      avanzarTurno();
      break;
  }
}

function avanzarTurno() {
  gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  gameState.cartaActual = null;
  guardarEstado();
  siguienteTurno();
}

function mostrarSeleccionGanador() {
  const carta = gameState.cartaActual;
  const mecanica = carta.mecanica || 'normal';
  const modal = document.getElementById('winner-modal');
  const backdrop = modal.querySelector('.modal-backdrop');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = '';
  
  gameState.jugadores.forEach((jugador, index) => {
    const btn = document.createElement('button');
    btn.className = 'winner-option-btn';
    btn.textContent = jugador.nombre;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (mecanica === 'seleccionar_ganador_turno_extra') {
        // CUPON NEGRO, MIL MANERAS: ganador + lector turno extra
        seleccionarGanadorTurnoExtra(index);
      } else {
        // Normal o MARADONA
        seleccionarGanadorGrupal(index);
      }
    });
    selectionDiv.appendChild(btn);
  });
  
  backdrop.addEventListener('click', cerrarModalGanador);
  modal.style.display = 'flex';
}

function seleccionarGanadorGrupal(indiceJugador) {
  cerrarModalGanador();
  document.getElementById('action-buttons').style.display = 'none';
  
  gameState.jugadores[indiceJugador].cartasGanadas++;
  avanzarTurno();
}

function seleccionarGanadorTurnoExtra(indiceGanador) {
  cerrarModalGanador();
  document.getElementById('action-buttons').style.display = 'none';
  
  // Ganador obtiene punto
  gameState.jugadores[indiceGanador].cartasGanadas++;
  
  // Lector NO avanza turno (turno extra)
  gameState.cartaActual = null;
  guardarEstado();
  siguienteTurno();
}

function mostrarSeleccionPerdedor() {
  const carta = gameState.cartaActual;
  const mecanica = carta.mecanica || 'normal';
  const modal = document.getElementById('perdedor-modal');
  const selectionDiv = document.getElementById('perdedor-selection');
  
  selectionDiv.innerHTML = '';
  
  gameState.jugadores.forEach((jugador, index) => {
    // Para seleccionar_perdedor_partida, excluir lector
    if (mecanica === 'seleccionar_perdedor_partida' && index === gameState.turnoActual) {
      return;
    }
    
    const btn = document.createElement('button');
    btn.className = 'winner-option-btn';
    btn.textContent = jugador.nombre;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (mecanica === 'seleccionar_perdedor_turno') {
        // CARTRUMP: pierde turno
        seleccionarPerdedorTurno(index);
      } else if (mecanica === 'seleccionar_perdedor_partida') {
        // POBRE POLENTA, BUENA GENTE: pierde partida
        seleccionarPerdedorPartida(index);
      }
    });
    selectionDiv.appendChild(btn);
  });
  
  modal.style.display = 'flex';
}

function seleccionarPerdedorTurno(indice) {
  document.getElementById('perdedor-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  // El elegido pierde su siguiente turno
  gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  if (gameState.turnoActual === indice) {
    gameState.turnoActual = (gameState.turnoActual + 1) % gameState.jugadores.length;
  }
  
  gameState.cartaActual = null;
  guardarEstado();
  siguienteTurno();
}

function seleccionarPerdedorPartida(indice) {
  document.getElementById('perdedor-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  // El elegido pierde la partida
  gameState.jugadores[indice].cartasGanadas = -9999;
  gameState.jugadores[indice].perdedor = true;
  
  // El lector gana punto
  gameState.jugadores[gameState.turnoActual].cartasGanadas++;
  
  avanzarTurno();
}

function mostrarSeleccionRobarTodas() {
  // CARTA DENGUE: seleccionar a quién robar todas las cartas
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = '';
  
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = `${jugador.nombre} (${jugador.cartasGanadas})`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        robarTodasLasCartas(index);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  modal.style.display = 'flex';
}

function robarTodasLasCartas(indiceVictima) {
  document.getElementById('winner-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  const ladron = gameState.jugadores[gameState.turnoActual];
  const victima = gameState.jugadores[indiceVictima];
  
  // Robar todas las cartas
  ladron.cartasGanadas += victima.cartasGanadas;
  
  // Victima pierde partida
  victima.cartasGanadas = -9999;
  victima.perdedor = true;
  
  avanzarTurno();
}

function mostrarApuesta() {
  // LUDOPATÍA, MUÑÓN PRÓTESIS: mostrar modal de apuesta
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = '<p style="color:#fff; margin-bottom:1rem;">Selecciona contrincante</p>';
  
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual && jugador.cartasGanadas > 0) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = `${jugador.nombre} (${jugador.cartasGanadas})`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        mostrarCantidadApuesta(index);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  modal.style.display = 'flex';
}

function mostrarCantidadApuesta(indiceContrincante) {
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  const cartasContrincante = gameState.jugadores[indiceContrincante].cartasGanadas;
  const maxApuesta = Math.min(cartasContrincante, 5); // Máximo 5 cartas
  
  selectionDiv.innerHTML = '<p style="color:#fff; margin-bottom:1rem;">¿Cuántas cartas apuestas?</p>';
  
  for (let i = 1; i <= maxApuesta; i++) {
    const btn = document.createElement('button');
    btn.className = 'winner-option-btn';
    btn.textContent = `${i} carta${i > 1 ? 's' : ''}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      mostrarDecisionContrincante(indiceContrincante, i);
    });
    selectionDiv.appendChild(btn);
  }
  
  modal.style.display = 'flex';
}

function mostrarDecisionContrincante(indiceContrincante, cantidad) {
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  const nombreLector = gameState.jugadores[gameState.turnoActual].nombre;
  
  selectionDiv.innerHTML = `
    <p style="color:#fff; margin-bottom:1rem;">${nombreLector} apuesta ${cantidad} carta${cantidad > 1 ? 's' : ''}</p>
    <p style="color:#fff; margin-bottom:1rem; font-size:0.9rem;">${gameState.jugadores[indiceContrincante].nombre}, ¿aceptas?</p>
  `;
  
  const btnAceptar = document.createElement('button');
  btnAceptar.className = 'winner-option-btn';
  btnAceptar.textContent = 'ACEPTAR (Piedra, Papel, Tijera)';
  btnAceptar.style.background = '#00ff00';
  btnAceptar.style.borderColor = '#00ff00';
  btnAceptar.style.color = '#000';
  btnAceptar.addEventListener('click', (e) => {
    e.stopPropagation();
    jugarPiedraPapelTijera(indiceContrincante, cantidad);
  });
  
  const btnRechazar = document.createElement('button');
  btnRechazar.className = 'winner-option-btn';
  btnRechazar.textContent = 'RECHAZAR';
  btnRechazar.style.background = '#ff4444';
  btnRechazar.style.borderColor = '#ff4444';
  btnRechazar.style.color = '#000';
  btnRechazar.addEventListener('click', (e) => {
    e.stopPropagation();
    contrincanteRechazaApuesta();
  });
  
  selectionDiv.appendChild(btnAceptar);
  selectionDiv.appendChild(btnRechazar);
  
  modal.style.display = 'flex';
}

function contrincanteRechazaApuesta() {
  document.getElementById('winner-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  // Lector gana su carta automáticamente
  gameState.jugadores[gameState.turnoActual].cartasGanadas++;
  
  avanzarTurno();
}

function jugarPiedraPapelTijera(indiceContrincante, cantidad) {
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = '<p style="color:#fff; margin-bottom:1rem;">Piedra, Papel o Tijera</p>';
  
  const opciones = ['Piedra', 'Papel', 'Tijera'];
  const eleccionContrincante = opciones[Math.floor(Math.random() * 3)];
  
  opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.className = 'winner-option-btn';
    btn.textContent = opcion;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      resolverPiedraPapelTijera(opcion, eleccionContrincante, indiceContrincante, cantidad);
    });
    selectionDiv.appendChild(btn);
  });
  
  modal.style.display = 'flex';
}

function resolverPiedraPapelTijera(eleccionLector, eleccionContrincante, indiceContrincante, cantidad) {
  document.getElementById('winner-modal').style.display = 'none';
  document.getElementById('action-buttons').style.display = 'none';
  
  // Determinar ganador
  let lectorGana = false;
  
  if (eleccionLector === eleccionContrincante) {
    // Empate - volver a jugar
    setTimeout(() => jugarPiedraPapelTijera(indiceContrincante, cantidad), 500);
    return;
  }
  
  if (
    (eleccionLector === 'Piedra' && eleccionContrincante === 'Tijera') ||
    (eleccionLector === 'Papel' && eleccionContrincante === 'Piedra') ||
    (eleccionLector === 'Tijera' && eleccionContrincante === 'Papel')
  ) {
    lectorGana = true;
  }
  
  if (lectorGana) {
    // Lector gana: obtiene su carta + cartas apostadas del contrincante
    gameState.jugadores[gameState.turnoActual].cartasGanadas += 1 + cantidad;
    gameState.jugadores[indiceContrincante].cartasGanadas -= cantidad;
  } else {
    // Contrincante gana: lector no gana su carta, contrincante obtiene cartas apostadas
    // Nota: lector apuesta cartas que NO tiene, así que contrincante las obtiene "de la nada"
    gameState.jugadores[indiceContrincante].cartasGanadas += cantidad;
  }
  
  avanzarTurno();
}

function mostrarSeleccionGanadorPuntos(puntos) {
  // Para EL PIBE TIGRE cuando falla
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = `<p style="color:#fff; margin-bottom:1rem;">¿Quién gana ${puntos} puntos?</p>`;
  
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = jugador.nombre;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        otorgarPuntos(index, puntos);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  modal.style.display = 'flex';
}

function mostrarSeleccionRoboExtra() {
  // EL PIBE TIGRE: acertó, roba 1 carta
  const modal = document.getElementById('winner-modal');
  const selectionDiv = document.getElementById('winner-selection');
  
  selectionDiv.innerHTML = '<p style="color:#fff; margin-bottom:1rem;">¿A quién le robas 1 carta?</p>';
  
  gameState.jugadores.forEach((jugador, index) => {
    if (index !== gameState.turnoActual && jugador.cartasGanadas > 0) {
      const btn = document.createElement('button');
      btn.className = 'winner-option-btn';
      btn.textContent = `${jugador.nombre} (${jugador.cartasGanadas})`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        robarUnaCartaExtra(index);
      });
      selectionDiv.appendChild(btn);
    }
  });
  
  modal.style.display = 'flex';
}

function robarUnaCartaExtra(indiceVictima) {
  document.getElementById('winner-modal').style.display = 'none';
  
  gameState.jugadores[gameState.turnoActual].cartasGanadas++;
  gameState.jugadores[indiceVictima].cartasGanadas--;
  
  avanzarTurno();
}

function otorgarPuntos(indice, puntos) {
  document.getElementById('winner-modal').style.display = 'none';
  
  gameState.jugadores[indice].cartasGanadas += puntos;
  
  avanzarTurno();
}

// ============================================
// FIN MECÁNICAS ESPECIALES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const exitBtn = document.getElementById('exit-btn');
  const inicioScreen = document.getElementById('inicio-screen');
  const configScreen = document.getElementById('config-screen');
  const gameScreen = document.getElementById('game-screen');
  const victoryScreen = document.getElementById('victory-screen');
  
  // Verificar si hay partida guardada
  const hayPartidaGuardada = cargarEstado();
  
  // Botón Entrar (disclaimer)
  enterBtn.addEventListener('click', async () => {
    const cargado = await cargarCartas();
    
    if (!cargado) {
      alert('Error al cargar las cartas');
      return;
    }

    inicioScreen.style.display = 'none';
    
    if (hayPartidaGuardada && gameState.fase === 'jugando') {
      // Restaurar partida en progreso
      restaurarPartida();
    } else {
      // Nueva partida - mostrar configuración
      mostrarConfiguracion();
    }
  });
  
  // Botón Salir
  exitBtn.addEventListener('click', () => {
    window.location.href = 'https://gabexe.github.io/';
  });
  
  // Configuración de jugadores
  const numPlayersInput = document.getElementById('num-players');
  const playersNamesContainer = document.getElementById('players-names-container');
  const startGameBtn = document.getElementById('start-game-btn');
  const configError = document.getElementById('config-error');
  
  // Generar campos de nombres al cambiar número de jugadores
  numPlayersInput.addEventListener('input', () => {
    const numPlayers = parseInt(numPlayersInput.value) || 3;
    generarCamposNombres(numPlayers);
  });
  
  // Iniciar partida
  startGameBtn.addEventListener('click', () => {
    const numPlayers = parseInt(numPlayersInput.value);
    
    if (numPlayers < 3 || numPlayers > 10) {
      mostrarErrorConfig('El número de jugadores debe estar entre 3 y 10');
      return;
    }
    
    // Obtener nombres
    const nombres = [];
    for (let i = 0; i < numPlayers; i++) {
      const input = document.getElementById(`player-name-${i}`);
      const nombre = input.value.trim();
      if (!nombre) {
        mostrarErrorConfig(`Ingresa el nombre del jugador ${i + 1}`);
        return;
      }
      nombres.push(nombre);
    }
    
    // Verificar duplicados (excepto en modo testing)
    const modoTesting = nombres.every(nombre => nombre.toLowerCase() === 'test');
    const nombresUnicos = new Set(nombres);
    if (!modoTesting && nombresUnicos.size !== nombres.length) {
      mostrarErrorConfig('Los nombres de los jugadores deben ser únicos');
      return;
    }
    
    // Verificar cartas suficientes (solo en modo normal)
    if (!modoTesting) {
      const cartasNecesarias = numPlayers * 7;
      if (cartas.length < cartasNecesarias) {
        mostrarErrorConfig(`No hay suficientes cartas. Se necesitan al menos ${cartasNecesarias} cartas para ${numPlayers} jugadores`);
        return;
      }
    }
    
    // Inicializar juego
    inicializarJuego(nombres);
  });
  
  // Botones de acción durante el juego
  document.getElementById('aceptar-btn').addEventListener('click', () => procesarAceptar());
  document.getElementById('rechazar-btn').addEventListener('click', () => procesarRechazar());
  document.getElementById('seleccionar-ganador-btn').addEventListener('click', () => mostrarSeleccionGanador());
  document.getElementById('seleccionar-perdedor-btn').addEventListener('click', () => mostrarSeleccionPerdedor());
  document.getElementById('robo-btn').addEventListener('click', () => mostrarSeleccionLadron());
  
  // Event listeners para mecánicas especiales
  document.getElementById('tirar-celular-btn').addEventListener('click', () => procesarTirarCelular());
  document.getElementById('robar-todas-btn').addEventListener('click', () => mostrarSeleccionRobarTodas());
  document.getElementById('apuesta-btn').addEventListener('click', () => mostrarApuesta());
  
  // Panel de información
  const togglePanelBtn = document.getElementById('toggle-panel-btn');
  const infoPanel = document.getElementById('info-panel');
  const closePanelBtn = document.getElementById('close-panel-btn');
  
  togglePanelBtn.addEventListener('click', () => {
    const cartaActual = document.querySelector('.card:not(.end-screen)');
    infoPanel.classList.add('panel-open');
    togglePanelBtn.style.display = 'none';
    if (cartaActual) cartaActual.classList.add('dimmed');
  });
  
  closePanelBtn.addEventListener('click', () => {
    const cartaActual = document.querySelector('.card:not(.end-screen)');
    infoPanel.classList.remove('panel-open');
    togglePanelBtn.style.display = 'flex';
    if (cartaActual) cartaActual.classList.remove('dimmed');
  });
  
  // Botón abandonar partida
  document.getElementById('abandon-game-btn').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres abandonar la partida? Se perderá el progreso.')) {
      limpiarEstado();
      location.reload();
    }
  });
  
  // Botón jugar de nuevo
  document.getElementById('play-again-btn').addEventListener('click', () => {
    limpiarEstado();
    location.reload();
  });
  
  // Generar campos de nombres iniciales
  generarCamposNombres(3);
});
