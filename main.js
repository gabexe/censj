let cartas = [];
let cartasRestantes = [];

// Clave de descifrado (debe coincidir con encrypt_cartas.py)
const KEY = "CON_ESO_NO_SE_JODE_2025";

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

document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const exitBtn = document.getElementById('exit-btn');
  const inicioScreen = document.getElementById('inicio-screen');
  const gameScreen = document.getElementById('game-screen');
  
  enterBtn.addEventListener('click', async () => {
    inicioScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    
    const cargado = await cargarCartas();
    
    if (cargado && cartasRestantes.length > 0) {
      const primeraCarta = cartaAleatoria();
      mostrarCarta(primeraCarta);
    } else {
      mostrarError('No hay cartas disponibles.');
    }
  });
  
  exitBtn.addEventListener('click', () => {
    window.location.href = 'https://gabexe.github.io/';
  });
  
  // Evento para cambiar de carta al hacer click en cualquier parte de la página
  gameScreen.addEventListener('click', (e) => {
    // No hacer nada si es el botón de restart
    if (e.target.closest('#restart-btn')) return;
    
    // Verificar que hay una carta activa (no end-screen)
    const currentCard = gameScreen.querySelector('.card:not(.end-screen)');
    if (currentCard && !currentCard.classList.contains('fade-out')) {
      const siguienteCarta = cartaAleatoria();
      mostrarCarta(siguienteCarta);
    }
  });
});
