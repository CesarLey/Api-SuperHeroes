// main.js para SuperPets
// Aquí irá la lógica global del juego

const API_URL = 'https://api-superheroes-8my1.onrender.com';
const TOKEN_KEY = 'superpets_token';

// Utilidad para obtener el token
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// --------- HÉROES ---------
async function fetchHeroes() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/heroes`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function createHero(heroData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/heroes`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(heroData)
  });
  return await res.json();
}

async function updateHero(heroId, heroData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/heroes/${heroId}`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(heroData)
  });
  return await res.json();
}

// Personalización local (color de vestimenta)
function getHeroColor(heroId) {
  return localStorage.getItem(`hero_color_${heroId}`) || '#185a9d';
}
function setHeroColor(heroId, color) {
  localStorage.setItem(`hero_color_${heroId}`, color);
}

// Personalización local (colores de vestimenta, logo y cinturón)
function getHeroColors(heroId) {
  return {
    suit: localStorage.getItem(`hero_color_suit_${heroId}`) || '#2196f3',
    logo: localStorage.getItem(`hero_color_logo_${heroId}`) || '#ffd600',
    belt: localStorage.getItem(`hero_color_belt_${heroId}`) || '#ffd600',
  };
}
function setHeroColors(heroId, colors) {
  localStorage.setItem(`hero_color_suit_${heroId}`, colors.suit);
  localStorage.setItem(`hero_color_logo_${heroId}`, colors.logo);
  localStorage.setItem(`hero_color_belt_${heroId}`, colors.belt);
}

// Renderizar sección de héroes
window.renderHeroesSection = async function() {
  const section = document.getElementById('heroesSection');
  section.innerHTML = '';
  const heroes = await fetchHeroes();
  if (heroes.length === 0) {
    section.innerHTML = `<form id="heroForm">
      <div class="form-group"><label>Nombre</label><input type="text" id="heroName" required></div>
      <div class="form-group"><label>Alias</label><input type="text" id="heroAlias" required></div>
      <div class="form-group"><label>Ciudad</label><input type="text" id="heroCity"></div>
      <button class="btn" type="submit">Crear Héroe</button>
      <div id="heroMsg" class="msg"></div>
    </form>`;
    document.getElementById('heroForm').onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('heroName').value.trim();
      const alias = document.getElementById('heroAlias').value.trim();
      const city = document.getElementById('heroCity').value.trim();
      const msgDiv = document.getElementById('heroMsg');
      msgDiv.textContent = '';
      const res = await createHero({ name, alias, city });
      if (res._id || res.id) {
        msgDiv.style.color = '#43cea2';
        msgDiv.textContent = '¡Héroe creado!';
        setTimeout(() => window.renderHeroesSection(), 1000);
      } else {
        msgDiv.style.color = '#d32f2f';
        msgDiv.textContent = res.error || 'Error al crear héroe.';
      }
    };
    return;
  }
  // Mostrar el primer héroe (puedes expandir para varios)
  const hero = heroes[0];
  const colors = getHeroColors(hero.id);
  section.innerHTML = `
    <div style="margin-bottom:16px;">
      <svg id="heroAvatar" width="120" height="160" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
        <!-- Cuerpo -->
        <ellipse id="heroBody" cx="60" cy="80" rx="45" ry="60" fill="${colors.suit}" stroke="#222" stroke-width="3"/>
        <!-- Cara -->
        <ellipse cx="60" cy="45" rx="28" ry="28" fill="#fff" stroke="#222" stroke-width="3"/>
        <!-- Sonrisa -->
        <path d="M48 60 Q60 75 72 60" stroke="#222" stroke-width="3" fill="none"/>
        <!-- Ojos -->
        <ellipse id="hero-eye-left" cx="50" cy="50" rx="4" ry="5" fill="#222"/>
        <ellipse id="hero-eye-right" cx="70" cy="50" rx="4" ry="5" fill="#222"/>
        <!-- Brazos -->
        <rect x="15" y="80" width="15" height="40" rx="8" fill="${colors.suit}" stroke="#222" stroke-width="3"/>
        <rect x="90" y="80" width="15" height="40" rx="8" fill="${colors.suit}" stroke="#222" stroke-width="3"/>
        <!-- Piernas -->
        <rect x="40" y="130" width="12" height="25" rx="6" fill="${colors.suit}" stroke="#222" stroke-width="3"/>
        <rect x="68" y="130" width="12" height="25" rx="6" fill="${colors.suit}" stroke="#222" stroke-width="3"/>
        <!-- Cinturón -->
        <rect id="heroBelt" x="38" y="120" width="44" height="14" rx="7" fill="${colors.belt}" stroke="#222" stroke-width="3"/>
        <!-- Logo -->
        <ellipse id="heroLogo" cx="60" cy="110" rx="14" ry="10" fill="${colors.logo}" stroke="#222" stroke-width="3"/>
        <text x="60" y="115" text-anchor="middle" font-size="16" font-family="Arial" font-weight="bold" fill="#d32f2f">S</text>
      </svg>
      <div><b>${hero.name}</b> (<i>${hero.alias}</i>)</div>
      <div>Ciudad: ${hero.city || '-'}</div>
      <div>ID: ${hero.id}</div>
    </div>
    <div style="margin-bottom:12px;">
      <label for="colorPickerSuit">Color traje:</label>
      <input type="color" id="colorPickerSuit" value="${colors.suit}" style="width:40px; height:32px; vertical-align:middle;">
      <label for="colorPickerLogo" style="margin-left:10px;">Logo:</label>
      <input type="color" id="colorPickerLogo" value="${colors.logo}" style="width:40px; height:32px; vertical-align:middle;">
      <label for="colorPickerBelt" style="margin-left:10px;">Cinturón:</label>
      <input type="color" id="colorPickerBelt" value="${colors.belt}" style="width:40px; height:32px; vertical-align:middle;">
      <button class="btn" id="saveColorBtn" style="width:auto;display:inline-block;padding:6px 18px;margin-left:8px;">Guardar</button>
    </div>
    <div id="heroColorMsg" class="msg"></div>
  `;
  document.getElementById('colorPickerSuit').oninput = function(e) {
    document.getElementById('heroBody').setAttribute('fill', e.target.value);
    document.querySelectorAll('#heroAvatar rect, #heroAvatar ellipse').forEach(el => {
      if (el.getAttribute('fill') === colors.suit) el.setAttribute('fill', e.target.value);
    });
  };
  document.getElementById('colorPickerLogo').oninput = function(e) {
    document.getElementById('heroLogo').setAttribute('fill', e.target.value);
  };
  document.getElementById('colorPickerBelt').oninput = function(e) {
    document.getElementById('heroBelt').setAttribute('fill', e.target.value);
  };
  document.getElementById('saveColorBtn').onclick = function() {
    const newColors = {
      suit: document.getElementById('colorPickerSuit').value,
      logo: document.getElementById('colorPickerLogo').value,
      belt: document.getElementById('colorPickerBelt').value
    };
    setHeroColors(hero.id, newColors);
    document.getElementById('heroColorMsg').style.color = '#43cea2';
    document.getElementById('heroColorMsg').textContent = '¡Colores guardados!';
  };
};

// Hook para cargar la sección de héroes cuando se navega
if (document.getElementById('heroesSection')) {
  window.renderHeroesSection();
}
// Puedes llamar window.renderHeroesSection() desde el HTML cuando cambies de sección 

// --------- MASCOTAS ---------
async function fetchPets() {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/pets`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function createPet(petData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/pets`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return await res.json();
}

async function updatePet(petId, petData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/pets/${petId}`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return await res.json();
}

// Personalización local (color de mascota)
function getPetColor(petId) {
  return localStorage.getItem(`pet_color_${petId}`) || '#43cea2';
}
function setPetColor(petId, color) {
  localStorage.setItem(`pet_color_${petId}`, color);
}

// Personalización local (colores de mascota)
function getPetColors(petId) {
  return {
    body: localStorage.getItem(`pet_color_body_${petId}`) || '#43cea2',
    details: localStorage.getItem(`pet_color_details_${petId}`) || '#ffd600',
  };
}
function setPetColors(petId, colors) {
  localStorage.setItem(`pet_color_body_${petId}`, colors.body);
  localStorage.setItem(`pet_color_details_${petId}`, colors.details);
}

// Función para obtener el SVG según el tipo de mascota
function getPetSVG(type) {
  return getPetSVGWithSize(type, 300, 400);
}

function getPetSVGWithSize(type, width, height) {
  const svgTemplates = {
    perro: `
      <svg id="petAvatar" width="${width}" height="${height}" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dogGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#F4A460"/>
            <stop offset="100%" style="stop-color:#D2691E"/>
          </radialGradient>
          <filter id="dropShadow">
            <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <radialGradient id="eyeShine" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
          </radialGradient>
        </defs>
        
        <g transform="translate(150, 90)" filter="url(#dropShadow)">
          <!-- Cuerpo regordete -->
          <ellipse cx="0" cy="80" rx="70" ry="75" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="3"/>
          
          <!-- Cabeza redonda y grande -->
          <ellipse cx="0" cy="-10" rx="55" ry="60" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="3"/>
          
          <!-- Hocico rechoncho -->
          <ellipse cx="0" cy="20" rx="25" ry="20" fill="#DEB887" stroke="#8B4513" stroke-width="2"/>
          
          <!-- Orejas caídas grandes -->
          <g id="dog-ears">
            <ellipse cx="-35" cy="-25" rx="18" ry="35" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2" transform="rotate(-20)"/>
            <ellipse cx="35" cy="-25" rx="18" ry="35" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2" transform="rotate(20)"/>
          </g>
          
          <!-- Ojos pequeños y alegres -->
          <g id="dog-eyes">
            <ellipse cx="-18" cy="-15" rx="8" ry="12" fill="#000"/>
            <ellipse cx="18" cy="-15" rx="8" ry="12" fill="#000"/>
            <ellipse cx="-15" cy="-18" rx="3" ry="5" fill="url(#eyeShine)"/>
            <ellipse cx="21" cy="-18" rx="3" ry="5" fill="url(#eyeShine)"/>
          </g>
          
          <!-- Nariz grande -->
          <ellipse cx="0" cy="15" rx="6" ry="5" fill="#000"/>
          
          <!-- Sonrisa grande -->
          <path d="M-18 30 Q0 45 18 30" stroke="#8B4513" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="0" cy="38" rx="12" ry="8" fill="#FF69B4" opacity="0.8"/>
          
          <!-- Mejillas regordetas -->
          <ellipse cx="-45" cy="5" rx="15" ry="12" fill="#D2691E" opacity="0.6"/>
          <ellipse cx="45" cy="5" rx="15" ry="12" fill="#D2691E" opacity="0.6"/>
          
          <!-- Brazos rechonchos -->
          <ellipse cx="-50" cy="60" rx="15" ry="30" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2"/>
          <ellipse cx="50" cy="60" rx="15" ry="30" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2"/>
          
          <!-- Solo 2 patas regordetas -->
          <ellipse cx="-25" cy="150" rx="20" ry="25" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2"/>
          <ellipse cx="25" cy="150" rx="20" ry="25" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2"/>
          
          <!-- Patitas -->
          <ellipse cx="-25" cy="170" rx="18" ry="10" fill="#8B4513"/>
          <ellipse cx="25" cy="170" rx="18" ry="10" fill="#8B4513"/>
          
          <!-- Cola regordeta -->
          <ellipse cx="55" cy="70" rx="15" ry="25" fill="url(#dogGradient)" stroke="#8B4513" stroke-width="2" transform="rotate(30)"/>
          
          <!-- Barriguita -->
          <ellipse cx="0" cy="90" rx="40" ry="35" fill="#FFFFFF" opacity="0.4"/>
          
          <!-- Manchitas -->
          <ellipse cx="-25" cy="70" rx="12" ry="18" fill="#8B4513" opacity="0.3"/>
          <ellipse cx="30" cy="95" rx="15" ry="12" fill="#8B4513" opacity="0.3"/>
        </g>
      </svg>
    `,
    gato: `
      <svg id="petAvatar" width="${width}" height="${height}" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="catGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#B8B8B8"/>
            <stop offset="100%" style="stop-color:#808080"/>
          </radialGradient>
          <filter id="catShadow">
            <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <radialGradient id="catEyeShine" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
          </radialGradient>
        </defs>
        
        <g transform="translate(150, 90)" filter="url(#catShadow)">
          <!-- Cuerpo regordete -->
          <ellipse cx="0" cy="80" rx="70" ry="75" fill="url(#catGradient)" stroke="#666" stroke-width="3"/>
          
          <!-- Cabeza redonda y grande -->
          <ellipse cx="0" cy="-10" rx="55" ry="60" fill="url(#catGradient)" stroke="#666" stroke-width="3"/>
          
          <!-- Orejas triangulares grandes -->
          <polygon points="-35,-55 -20,-85 -5,-60" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          <polygon points="35,-55 20,-85 5,-60" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          <polygon points="-30,-65 -20,-80 -15,-67" fill="#FF69B4"/>
          <polygon points="30,-65 20,-80 15,-67" fill="#FF69B4"/>
          
          <!-- Ojos grandes y redondos -->
          <ellipse cx="-18" cy="-15" rx="12" ry="15" fill="#32CD32"/>
          <ellipse cx="18" cy="-15" rx="12" ry="15" fill="#32CD32"/>
          <ellipse cx="-18" cy="-15" rx="5" ry="12" fill="#000"/>
          <ellipse cx="18" cy="-15" rx="5" ry="12" fill="#000"/>
          <ellipse cx="-15" cy="-20" rx="3" ry="5" fill="url(#catEyeShine)"/>
          <ellipse cx="21" cy="-20" rx="3" ry="5" fill="url(#catEyeShine)"/>
          
          <!-- Nariz triangular grande -->
          <polygon points="0,10 -6,18 6,18" fill="#FF69B4"/>
          
          <!-- Sonrisa de gato regordete -->
          <path d="M0 18 Q-12 28 -18 25" stroke="#666" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M0 18 Q12 28 18 25" stroke="#666" stroke-width="3" fill="none" stroke-linecap="round"/>
          
          <!-- Bigotes gruesos -->
          <line x1="-50" y1="8" x2="-70" y2="5" stroke="#000" stroke-width="3"/>
          <line x1="-50" y1="15" x2="-70" y2="15" stroke="#000" stroke-width="3"/>
          <line x1="50" y1="8" x2="70" y2="5" stroke="#000" stroke-width="3"/>
          <line x1="50" y1="15" x2="70" y2="15" stroke="#000" stroke-width="3"/>
          
          <!-- Mejillas regordetas -->
          <ellipse cx="-45" cy="5" rx="15" ry="12" fill="#808080" opacity="0.6"/>
          <ellipse cx="45" cy="5" rx="15" ry="12" fill="#808080" opacity="0.6"/>
          
          <!-- Pecho blanco regordete -->
          <ellipse cx="0" cy="70" rx="35" ry="50" fill="#FFFFFF" opacity="0.9"/>
          
          <!-- Brazos rechonchos -->
          <ellipse cx="-50" cy="60" rx="15" ry="30" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          <ellipse cx="50" cy="60" rx="15" ry="30" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          
          <!-- Solo 2 patas regordetas -->
          <ellipse cx="-25" cy="150" rx="20" ry="25" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          <ellipse cx="25" cy="150" rx="20" ry="25" fill="url(#catGradient)" stroke="#666" stroke-width="2"/>
          
          <!-- Patitas blancas -->
          <ellipse cx="-25" cy="170" rx="18" ry="10" fill="#FFFFFF"/>
          <ellipse cx="25" cy="170" rx="18" ry="10" fill="#FFFFFF"/>
          
          <!-- Cola regordeta y curva -->
          <ellipse cx="55" cy="60" rx="12" ry="35" fill="url(#catGradient)" stroke="#666" stroke-width="2" transform="rotate(45)"/>
          <ellipse cx="70" cy="30" rx="10" ry="25" fill="url(#catGradient)" stroke="#666" stroke-width="2" transform="rotate(80)"/>
          
          <!-- Barriguita -->
          <ellipse cx="0" cy="90" rx="40" ry="35" fill="#FFFFFF" opacity="0.5"/>
        </g>
      </svg>
    `,
    conejo: `
      <svg id="petAvatar" width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rabbitGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#FFFEF7"/>
            <stop offset="100%" style="stop-color:#F5F5DC"/>
          </radialGradient>
          <filter id="rabbitShadow">
            <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <radialGradient id="rabbitEyeShine" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
          </radialGradient>
        </defs>
        
        <g transform="translate(150, 90)" filter="url(#rabbitShadow)">
          <!-- Cuerpo regordete -->
          <ellipse cx="0" cy="80" rx="70" ry="75" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="3"/>
          
          <!-- Cabeza redonda y grande -->
          <ellipse cx="0" cy="-10" rx="55" ry="60" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="3"/>
          
          <!-- Orejas largas y regordetas -->
          <ellipse cx="-25" cy="-70" rx="15" ry="45" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          <ellipse cx="25" cy="-70" rx="15" ry="45" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          <ellipse cx="-25" cy="-65" rx="8" ry="35" fill="#FFB6C1"/>
          <ellipse cx="25" cy="-65" rx="8" ry="35" fill="#FFB6C1"/>
          
          <!-- Ojos enormes y tiernos -->
          <ellipse cx="-18" cy="-15" rx="15" ry="20" fill="#000"/>
          <ellipse cx="18" cy="-15" rx="15" ry="20" fill="#000"/>
          <ellipse cx="-12" cy="-20" rx="6" ry="8" fill="url(#rabbitEyeShine)"/>
          <ellipse cx="24" cy="-20" rx="6" ry="8" fill="url(#rabbitEyeShine)"/>
          
          <!-- Nariz regordeta -->
          <ellipse cx="0" cy="8" rx="6" ry="4" fill="#FFB6C1"/>
          
          <!-- Boca de conejo regordete -->
          <path d="M0 12 Q-8 22 -15 18" stroke="#D2B48C" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M0 12 Q8 22 15 18" stroke="#D2B48C" stroke-width="3" fill="none" stroke-linecap="round"/>
          <line x1="0" y1="12" x2="0" y2="25" stroke="#D2B48C" stroke-width="3" stroke-linecap="round"/>
          
          <!-- Mejillas súper regordetas -->
          <ellipse cx="-45" cy="5" rx="18" ry="15" fill="#FFB6C1" opacity="0.7"/>
          <ellipse cx="45" cy="5" rx="18" ry="15" fill="#FFB6C1" opacity="0.7"/>
          
          <!-- Pecho blanco regordete -->
          <ellipse cx="0" cy="70" rx="40" ry="55" fill="#FFFFFF" opacity="0.8"/>
          
          <!-- Brazos rechonchos -->
          <ellipse cx="-50" cy="60" rx="15" ry="30" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          <ellipse cx="50" cy="60" rx="15" ry="30" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          
          <!-- Solo 2 patas regordetas (patas de conejo) -->
          <ellipse cx="-25" cy="150" rx="25" ry="20" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          <ellipse cx="25" cy="150" rx="25" ry="20" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          
          <!-- Detalles de las patas -->
          <ellipse cx="-25" cy="165" rx="20" ry="8" fill="#D2B48C" opacity="0.5"/>
          <ellipse cx="25" cy="165" rx="20" ry="8" fill="#D2B48C" opacity="0.5"/>
          
          <!-- Cola pompón regordeta -->
          <circle cx="55" cy="90" r="20" fill="url(#rabbitGradient)" stroke="#D2B48C" stroke-width="2"/>
          <circle cx="55" cy="90" r="15" fill="#FFFFFF" opacity="0.7"/>
          
          <!-- Barriguita -->
          <ellipse cx="0" cy="90" rx="40" ry="35" fill="#FFFFFF" opacity="0.5"/>
        </g>
      </svg>
    `,
    caballo: `
      <svg id="petAvatar" width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="horseGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#CD853F"/>
            <stop offset="100%" style="stop-color:#8B4513"/>
          </radialGradient>
          <filter id="horseShadow">
            <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <radialGradient id="horseEyeShine" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
          </radialGradient>
        </defs>
        
        <g transform="translate(150, 90)" filter="url(#horseShadow)">
          <!-- Cuerpo regordete -->
          <ellipse cx="0" cy="80" rx="70" ry="75" fill="url(#horseGradient)" stroke="#654321" stroke-width="3"/>
          
          <!-- Cuello regordete -->
          <ellipse cx="0" cy="15" rx="45" ry="50" fill="url(#horseGradient)" stroke="#654321" stroke-width="3"/>
          
          <!-- Cabeza regordeta (menos alargada) -->
          <ellipse cx="0" cy="-25" rx="35" ry="45" fill="url(#horseGradient)" stroke="#654321" stroke-width="3"/>
          
          <!-- Hocico regordete -->
          <ellipse cx="0" cy="5" rx="20" ry="25" fill="#A0522D" stroke="#654321" stroke-width="2"/>
          
          <!-- Orejas regordetas -->
          <ellipse cx="-25" cy="-60" rx="10" ry="20" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          <ellipse cx="25" cy="-60" rx="10" ry="20" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          
          <!-- Ojos grandes y tiernos -->
          <ellipse cx="-15" cy="-30" rx="10" ry="15" fill="#000"/>
          <ellipse cx="15" cy="-30" rx="10" ry="15" fill="#000"/>
          <ellipse cx="-12" cy="-33" rx="4" ry="6" fill="url(#horseEyeShine)"/>
          <ellipse cx="18" cy="-33" rx="4" ry="6" fill="url(#horseEyeShine)"/>
          
          <!-- Fosas nasales regordetas -->
          <ellipse cx="-5" cy="8" rx="4" ry="6" fill="#000"/>
          <ellipse cx="5" cy="8" rx="4" ry="6" fill="#000"/>
          
          <!-- Sonrisa regordeta -->
          <path d="M-12 20 Q0 30 12 20" stroke="#654321" stroke-width="3" fill="none" stroke-linecap="round"/>
          
          <!-- Mejillas regordetas -->
          <ellipse cx="-40" cy="-10" rx="15" ry="12" fill="#8B4513" opacity="0.6"/>
          <ellipse cx="40" cy="-10" rx="15" ry="12" fill="#8B4513" opacity="0.6"/>
          
          <!-- Crin regordeta y abundante -->
          <ellipse cx="-30" cy="-50" rx="12" ry="25" fill="#654321" transform="rotate(-30)"/>
          <ellipse cx="-20" cy="-55" rx="10" ry="20" fill="#654321" transform="rotate(-15)"/>
          <ellipse cx="-10" cy="-58" rx="8" ry="18" fill="#654321"/>
          <ellipse cx="5" cy="-57" rx="8" ry="18" fill="#654321" transform="rotate(15)"/>
          
          <!-- Brazos rechonchos -->
          <ellipse cx="-50" cy="60" rx="15" ry="30" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          <ellipse cx="50" cy="60" rx="15" ry="30" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          
          <!-- Solo 2 patas regordetas -->
          <ellipse cx="-25" cy="150" rx="22" ry="28" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          <ellipse cx="25" cy="150" rx="22" ry="28" fill="url(#horseGradient)" stroke="#654321" stroke-width="2"/>
          
          <!-- Cascos regordetes -->
          <ellipse cx="-25" cy="175" rx="18" ry="8" fill="#333"/>
          <ellipse cx="25" cy="175" rx="18" ry="8" fill="#333"/>
          
          <!-- Cola regordeta -->
          <ellipse cx="55" cy="90" rx="15" ry="40" fill="#654321" stroke="#654321" stroke-width="2" transform="rotate(20)"/>
          
          <!-- Barriguita -->
          <ellipse cx="0" cy="90" rx="40" ry="35" fill="#A0522D" opacity="0.4"/>
        </g>
      </svg>
    `,
    cochino: `
      <svg id="petAvatar" width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pigGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#FFE4E1;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#FFC0CB"/>
          </radialGradient>
          <filter id="pigShadow">
            <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          <radialGradient id="pigEyeShine" cx="30%" cy="30%" r="40%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9"/>
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
          </radialGradient>
        </defs>
        
        <g transform="translate(150, 90)" filter="url(#pigShadow)">
          <!-- Cuerpo regordete -->
          <ellipse id="petBody" cx="0" cy="80" rx="70" ry="75" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="3"/>
          
          <!-- Cabeza redonda -->
          <ellipse cx="0" cy="-10" rx="50" ry="55" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="3"/>
          
          <!-- Orejas triangulares caídas -->
          <polygon points="-30,-50 -15,-75 -5,-55" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          <polygon points="30,-50 15,-75 5,-55" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          
          <!-- Ojos alegres y pequeños -->
          <ellipse cx="-15" cy="-20" rx="7" ry="10" fill="#000"/>
          <ellipse cx="15" cy="-20" rx="7" ry="10" fill="#000"/>
          <ellipse cx="-12" cy="-23" rx="3" ry="4" fill="url(#pigEyeShine)"/>
          <ellipse cx="18" cy="-23" rx="3" ry="4" fill="url(#pigEyeShine)"/>
          
          <!-- Hocico grande y prominente -->
          <ellipse cx="0" cy="15" rx="22" ry="18" fill="#FF69B4" stroke="#FF1493" stroke-width="2"/>
          
          <!-- Fosas nasales grandes -->
          <ellipse cx="-6" cy="15" rx="3" ry="5" fill="#000"/>
          <ellipse cx="6" cy="15" rx="3" ry="5" fill="#000"/>
          
          <!-- Sonrisa grande -->
          <path d="M-15 30 Q0 42 15 30" stroke="#FF1493" stroke-width="3" fill="none" stroke-linecap="round"/>
          
          <!-- Mejillas muy rosadas -->
          <ellipse cx="-40" cy="-5" rx="12" ry="10" fill="#FF69B4" opacity="0.7"/>
          <ellipse cx="40" cy="-5" rx="12" ry="10" fill="#FF69B4" opacity="0.7"/>
          
          <!-- Solo 2 patas rechonchas -->
          <ellipse cx="-25" cy="150" rx="18" ry="20" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          <ellipse cx="25" cy="150" rx="18" ry="20" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          
          <!-- Pezuñas -->
          <ellipse cx="-25" cy="165" rx="15" ry="8" fill="#8B4513"/>
          <ellipse cx="25" cy="165" rx="15" ry="8" fill="#8B4513"/>
          
          <!-- División de pezuñas -->
          <line x1="-25" y1="160" x2="-25" y2="170" stroke="#654321" stroke-width="2"/>
          <line x1="25" y1="160" x2="25" y2="170" stroke="#654321" stroke-width="2"/>
          
          <!-- Brazos pequeños -->
          <ellipse cx="-45" cy="60" rx="12" ry="25" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          <ellipse cx="45" cy="60" rx="12" ry="25" fill="url(#pigGradient)" stroke="#FF69B4" stroke-width="2"/>
          
          <!-- Cola en espiral adorable -->
          <path d="M65 85 Q75 80 73 75 Q70 72 72 76 Q75 80 73 83 Q70 85 72 87" stroke="#FF69B4" stroke-width="8" fill="none" stroke-linecap="round"/>
          
          <!-- Barriguita prominente -->
          <ellipse cx="0" cy="90" rx="35" ry="30" fill="#FFFFFF" opacity="0.4"/>
          
          <!-- Manchitas -->
          <ellipse cx="-20" cy="70" rx="8" ry="12" fill="#FFD700" opacity="0.3"/>
          <ellipse cx="25" cy="95" rx="10" ry="8" fill="#FFD700" opacity="0.3"/>
        </g>
      </svg>
    `
  };
  return svgTemplates[type] || svgTemplates.perro;
}

// Función para obtener el SVG del héroe con colores personalizados
function getHeroSVG(heroId) {
  const colors = getHeroColors(heroId);
  return `
    <svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="heroShadow">
          <feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <g transform="translate(150, 90)" filter="url(#heroShadow)">
        <!-- Cuerpo -->
        <ellipse cx="0" cy="80" rx="50" ry="60" fill="${colors.suit}" stroke="#333" stroke-width="3"/>
        
        <!-- Cabeza -->
        <ellipse cx="0" cy="-10" rx="35" ry="40" fill="#FFE4C4" stroke="#333" stroke-width="3"/>
        
        <!-- Cara -->
        <ellipse cx="0" cy="-15" rx="25" ry="30" fill="#FFE4C4" stroke="#333" stroke-width="2"/>
        
        <!-- Ojos -->
        <g id="hero-eyes">
          <ellipse cx="-8" cy="-20" rx="4" ry="6" fill="#000"/>
          <ellipse cx="8" cy="-20" rx="4" ry="6" fill="#000"/>
          <ellipse cx="-6" cy="-22" rx="2" ry="3" fill="#FFF"/>
          <ellipse cx="10" cy="-22" rx="2" ry="3" fill="#FFF"/>
        </g>
        
        <!-- Boca -->
        <path d="M-5 -5 Q0 2 5 -5" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>
        
        <!-- Brazos -->
        <g id="hero-arm-left-group">
          <ellipse cx="-40" cy="40" rx="15" ry="35" fill="${colors.suit}" stroke="#333" stroke-width="2"/>
          <ellipse cx="-40" cy="70" rx="8" ry="12" fill="#FFE4C4" stroke="#333" stroke-width="2"/>
        </g>
        <g id="hero-arm-right-group">
          <ellipse cx="40" cy="40" rx="15" ry="35" fill="${colors.suit}" stroke="#333" stroke-width="2"/>
          <ellipse cx="40" cy="70" rx="8" ry="12" fill="#FFE4C4" stroke="#333" stroke-width="2"/>
        </g>
        
        <!-- Manos -->
        <ellipse cx="-40" cy="70" rx="8" ry="12" fill="#FFE4C4" stroke="#333" stroke-width="2"/>
        <ellipse cx="40" cy="70" rx="8" ry="12" fill="#FFE4C4" stroke="#333" stroke-width="2"/>
        
        <!-- Piernas -->
        <ellipse cx="-15" cy="130" rx="12" ry="25" fill="${colors.suit}" stroke="#333" stroke-width="2"/>
        <ellipse cx="15" cy="130" rx="12" ry="25" fill="${colors.suit}" stroke="#333" stroke-width="2"/>
        
        <!-- Botas -->
        <ellipse cx="-15" cy="155" rx="10" ry="8" fill="#333" stroke="#333" stroke-width="2"/>
        <ellipse cx="15" cy="155" rx="10" ry="8" fill="#333" stroke="#333" stroke-width="2"/>
        
        <!-- Cinturón -->
        <ellipse cx="0" cy="95" rx="30" ry="8" fill="${colors.belt}" stroke="#333" stroke-width="2"/>
        <ellipse cx="0" cy="95" rx="25" ry="6" fill="none" stroke="#333" stroke-width="1"/>
        
        <!-- Logo "S" en el pecho -->
        <text x="0" y="75" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              fill="${colors.logo}" text-anchor="middle" stroke="#333" stroke-width="1">S</text>
        
        <!-- Capa -->
        <ellipse cx="0" cy="60" rx="45" ry="25" fill="none" stroke="#333" stroke-width="3" opacity="0.7"/>
      </g>
    </svg>
  `;
}

// Función para adoptar una mascota
async function adoptPet(heroId, petId) {
  try {
    console.log('Intentando adoptar mascota:', { heroId, petId });
    
    const response = await fetch(`${API_URL}/api/heroes/${heroId}/adopt_pet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ petId: parseInt(petId) })
    });
    
    console.log('Respuesta del servidor:', { status: response.status, statusText: response.statusText });
    
    if (!response.ok) {
      // Obtener el texto de la respuesta del servidor
      const responseText = await response.text();
      console.log('Respuesta completa del servidor:', responseText);
      
      // Buscar directamente el mensaje de error en el texto
      if (responseText.includes('ya tiene una mascota adoptada')) {
        // Extraer el mensaje del JSON manualmente
        const match = responseText.match(/"error":"([^"]+)"/);
        if (match) {
          throw new Error(match[1]);
        }
      }
      
      // Si no encuentra el mensaje específico, intentar parsear como JSON
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al adoptar mascota:', error);
    throw error;
  }
}

async function unadoptPet(heroId, petId) {
  try {
    const response = await fetch(`${API_URL}/api/heroes/${heroId}/unadopt_pet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ petId: parseInt(petId) })
    });
    
    if (!response.ok) {
      // Obtener el texto de la respuesta del servidor
      const responseText = await response.text();
      
      try {
        // Intentar parsear como JSON
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      } catch (parseError) {
        // Si el texto contiene el mensaje específico, usarlo
        if (responseText.includes('ya tiene una mascota adoptada')) {
          // Extraer el mensaje del JSON manualmente
          const match = responseText.match(/"error":"([^"]+)"/);
          if (match) {
            throw new Error(match[1]);
          }
        }
        // Si no se puede parsear, usar el mensaje por defecto
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al desadoptar mascota:', error);
    throw error;
  }
}

// Función para realizar acciones con la mascota
async function performPetAction(petId, action, cantidad = null) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    };

    // Si es alimentar y se proporciona cantidad, agregar al body
    if (action === 'alimentar' && cantidad !== null) {
      requestOptions.body = JSON.stringify({ cantidad: cantidad });
    }

    const response = await fetch(`${API_URL}/api/pets/${petId}/${action}`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al ${action} mascota:`, error);
    throw error;
  }
}

// Renderizar sección de adopción
window.renderAdoptarSection = async function() {
  const section = document.getElementById('adoptarSection');
  section.innerHTML = '';
  
  try {
    const heroes = await fetchHeroes();
    const pets = await fetchPets();
    
    if (heroes.length === 0) {
      section.innerHTML = `
        <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
          Primero debes crear un héroe para poder adoptar mascotas.
        </div>
      `;
      return;
    }
    
    if (pets.length === 0) {
      section.innerHTML = `
        <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
          No hay mascotas disponibles para adoptar. Primero crea una mascota.
        </div>
      `;
      return;
    }
    
    // Crear selector de héroe
    const heroSelector = document.createElement('div');
    heroSelector.style.marginBottom = '20px';
    heroSelector.innerHTML = `
      <label for="heroSelect" style="font-weight: bold; margin-right: 10px;">Seleccionar Héroe:</label>
      <select id="heroSelect" onchange="onHeroSelectChange()" style="padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
        ${heroes.map(hero => `<option value="${hero.id}">${hero.name} (${hero.alias}) - ${hero.city}</option>`).join('')}
      </select>
    `;
    section.appendChild(heroSelector);
    
    // Mostrar información del héroe seleccionado
    const heroInfo = document.createElement('div');
    heroInfo.id = 'heroInfo';
    heroInfo.style.marginBottom = '20px';
    section.appendChild(heroInfo);
    
    // Mostrar mascotas disponibles
    const availablePetsSection = document.createElement('div');
    availablePetsSection.innerHTML = `
      <h3>Mascotas disponibles para adoptar:</h3>
      <div id="availablePetsList" style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; justify-content: flex-start; align-items: flex-start;"></div>
    `;
    section.appendChild(availablePetsSection);
    

    
    // Mensaje de estado
    const msgDiv = document.createElement('div');
    msgDiv.id = 'adoptMsg';
    msgDiv.className = 'msg';
    section.appendChild(msgDiv);
    
    // Cargar datos del primer héroe por defecto
    onHeroSelectChange();
    
  } catch (error) {
    section.innerHTML = `
      <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
        Error al cargar datos: ${error.message}
      </div>
    `;
  }
};

// Función para manejar el cambio de héroe seleccionado
window.onHeroSelectChange = async function() {
  const heroSelect = document.getElementById('heroSelect');
  const heroId = parseInt(heroSelect.value);
  const hero = (await fetchHeroes()).find(h => h.id === heroId);
  const pets = await fetchPets();
  
  // Actualizar información del héroe
  const heroInfo = document.getElementById('heroInfo');
  heroInfo.innerHTML = `
    <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; border-left: 4px solid #2196F3;">
      <h3>🏠 Héroe: ${hero.name} (${hero.alias})</h3>
      <p>🏙️ Ciudad: ${hero.city}</p>
    </div>
  `;
  
  // Filtrar solo mascotas disponibles
  const availablePets = pets.filter(pet => !pet.adoptedBy);
  
  // Mostrar mascotas disponibles
  const availablePetsList = document.getElementById('availablePetsList');
  availablePetsList.innerHTML = '';
  
  if (availablePets.length === 0) {
    availablePetsList.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 20px;">
        No hay mascotas disponibles para adoptar.
      </div>
    `;
  } else {
    availablePets.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      petCard.style.cssText = `
        border: 2px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        min-width: 200px;
        max-width: 250px;
        flex: 0 1 auto;
      `;
      
      petCard.innerHTML = `
        <div style="margin-bottom: 15px; text-align: center;">
          <div style="width: 80px; height: 100px; margin: 0 auto; overflow: hidden;">
            ${getPetSVGWithSize(pet.type, 80, 100)}
          </div>
        </div>
        <div style="margin-bottom: 5px;">
          <strong>${pet.name} (${pet.type})</strong>
        </div>
        <div style="margin-bottom: 5px; font-size: 12px; color: #666;">
          ID: ${pet.id}
        </div>
        <div style="margin-bottom: 10px; font-size: 12px; color: #666;">
          Disponible para adoptar
        </div>
        <button class="btn" onclick="adoptPetAction(${heroId}, ${pet.id})" style="background: #4CAF50; color: white; padding: 8px 12px; font-size: 12px;">
          🏠 Adoptar
        </button>
      `;
      
      availablePetsList.appendChild(petCard);
    });
  }
};

// Función para manejar la adopción
window.adoptPetAction = async function(heroId, petId) {
  const msgDiv = document.getElementById('adoptMsg');
  
  // Verificar que el elemento existe
  if (!msgDiv) {
    console.error('No se encontró el elemento adoptMsg');
    return;
  }
  
  msgDiv.textContent = '';
  
  try {
    await adoptPet(heroId, petId);
    msgDiv.style.color = '#43cea2';
    msgDiv.textContent = '¡Mascota adoptada con éxito! 🎉';
    
    // Recargar la sección después de un momento
    setTimeout(() => {
      onHeroSelectChange();
    }, 1500);
    
  } catch (error) {
    console.log('Error en adopción:', error.message); // Debug log
    console.log('Error completo:', error); // Debug log completo
    
    msgDiv.style.color = '#e57373';
    
    // Verificar si es un error 400 (que indica que el héroe ya tiene una mascota)
    if (error.message.includes('400') || error.message.includes('Bad Request')) {
      // Mostrar el mensaje específico para este caso
      msgDiv.innerHTML = `
        <div style="text-align: left; padding: 15px; background: #fff3cd; border: 2px solid #ffeaa7; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 18px; font-weight: bold; color: #856404; margin-bottom: 10px;">
            ⚠️ El héroe ya tiene una mascota adoptada
          </div>
          <p style="margin: 8px 0; color: #856404;">Para adoptar esta mascota, tienes dos opciones:</p>
          <ul style="margin: 8px 0; padding-left: 20px; color: #856404;">
            <li><strong>Selecciona otro héroe</strong> del menú desplegable</li>
            <li><strong>Ve a la pestaña "Ver Todas las Mascotas"</strong> para desadoptar la mascota actual del héroe</li>
          </ul>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div style="text-align: left; padding: 10px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;">
          <strong>Error al adoptar:</strong> ${error.message}
        </div>
      `;
    }
  }
};

// Función para manejar la desadopción
window.unadoptPetAction = async function(heroId, petId) {
  const msgDiv = document.getElementById('adoptMsg');
  msgDiv.textContent = '';
  
  try {
    await unadoptPet(heroId, petId);
    msgDiv.style.color = '#43cea2';
    msgDiv.textContent = '¡Mascota desadoptada con éxito! 🏠';
    
    // Recargar la sección después de un momento
    setTimeout(() => {
      onHeroSelectChange();
    }, 1500);
    
  } catch (error) {
    msgDiv.style.color = '#e57373';
    msgDiv.textContent = `Error al desadoptar: ${error.message}`;
  }
};

// Función para desadoptar mascota desde la lista de todas las mascotas
window.unadoptPetFromList = async function(heroId, petId) {
  try {
    await unadoptPet(heroId, petId);
    // Mostrar mensaje temporal
    const tempMsg = document.createElement('div');
    tempMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #43cea2;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: bold;
    `;
    tempMsg.textContent = '¡Mascota desadoptada con éxito! 🏠';
    document.body.appendChild(tempMsg);
    
    // Remover mensaje después de 2 segundos
    setTimeout(() => {
      if (tempMsg.parentNode) {
        tempMsg.parentNode.removeChild(tempMsg);
      }
    }, 2000);
    
    // Refrescar la sección
    setTimeout(() => {
      renderTodasMascotasSection();
    }, 500);
  } catch (error) {
    // Mostrar mensaje de error
    const tempMsg = document.createElement('div');
    tempMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: bold;
      max-width: 300px;
    `;
    
    // Mensaje personalizado para el error de héroe con mascota ya adoptada
    if (error.message.includes('ya tiene una mascota adoptada')) {
      tempMsg.innerHTML = `
        <div style="text-align: left;">
          <strong>⚠️ El héroe ya tiene una mascota adoptada</strong><br>
          <small>Selecciona otro héroe o desadopta la mascota actual</small>
        </div>
      `;
    } else {
      tempMsg.textContent = `Error al desadoptar: ${error.message}`;
    }
    
    document.body.appendChild(tempMsg);
    
    // Remover mensaje después de 4 segundos para dar tiempo a leer
    setTimeout(() => {
      if (tempMsg.parentNode) {
        tempMsg.parentNode.removeChild(tempMsg);
      }
    }, 4000);
  }
};

// Renderizar sección de todas las mascotas con información de adopción
window.renderTodasMascotasSection = async function() {
  const section = document.getElementById('todasSection');
  section.innerHTML = '';
  
  try {
    const heroes = await fetchHeroes();
    const pets = await fetchPets();
    
    // Filtrar solo mascotas adoptadas
    const adoptedPets = pets.filter(pet => pet.adoptedBy);
    
    if (adoptedPets.length === 0) {
      section.innerHTML = `
        <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
          No hay mascotas adoptadas. Ve a la pestaña "Adoptar" para adoptar mascotas.
        </div>
      `;
      return;
    }
    
    // Crear lista de mascotas con información de adopción
    const petsList = document.createElement('div');
    petsList.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 15px;
      justify-content: flex-start;
      align-items: flex-start;
    `;
    
    adoptedPets.forEach(pet => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      
      const adoptedHero = heroes.find(h => h.id === pet.adoptedBy);
      petCard.style.cssText = `
        border: 2px solid #4CAF50;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        background: #f1f8e9;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        min-width: 200px;
        max-width: 250px;
        flex: 0 1 auto;
      `;
      
      petCard.innerHTML = `
        <div style="margin-bottom: 15px; text-align: center;">
          <div style="width: 80px; height: 100px; margin: 0 auto; overflow: hidden;">
            ${getPetSVGWithSize(pet.type, 80, 100)}
          </div>
        </div>
        <div style="margin-bottom: 5px;">
          <strong>${pet.name} (${pet.type})</strong>
        </div>
        <div style="margin-bottom: 5px; font-size: 12px; color: #666;">
          ID: ${pet.id}
        </div>
        <div style="margin-bottom: 5px; font-size: 12px; color: #4CAF50; font-weight: bold;">
          ✅ Adoptada por: ${adoptedHero ? adoptedHero.name : 'Héroe desconocido'}
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
          Héroe: ${adoptedHero ? `${adoptedHero.alias} (${adoptedHero.city})` : 'N/A'}
        </div>
        <button class="btn" onclick="unadoptPetFromList(${pet.adoptedBy}, ${pet.id})" style="background: #f44336; color: white; padding: 8px 12px; font-size: 12px;">
          🚫 Desadoptar
        </button>
      `;
      
      petsList.appendChild(petCard);
    });
    
    section.appendChild(petsList);
    
  } catch (error) {
    section.innerHTML = `
      <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
        Error al cargar mascotas: ${error.message}
      </div>
    `;
  }
};

// Renderizar sección de héroe y mascota
window.renderHeroeMascotaSection = async function() {
  const section = document.getElementById('heroeMascotaSection');
  section.innerHTML = '';
  
  try {
    const heroes = await fetchHeroes();
    const pets = await fetchPets();
    
    if (heroes.length === 0) {
      section.innerHTML = `
        <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
          No tienes un héroe creado. Primero crea un héroe.
        </div>
      `;
      return;
    }
    
    const hero = heroes[0];
    const adoptedPet = pets.find(pet => pet.adoptedBy === hero.id);
    
    if (!adoptedPet) {
      section.innerHTML = `
        <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
          Tu héroe no tiene una mascota adoptada. Ve a la sección "Adoptar" para adoptar una mascota.
        </div>
      `;
      return;
    }
    
    section.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <!-- Héroe -->
        <div style="text-align: center;">
          <h3>Tu Héroe</h3>
          <div style="margin-bottom: 15px;">
            ${getHeroSVG(hero.id)}
          </div>
          <div>
            <strong>${hero.name}</strong> (${hero.alias})
          </div>
          <div>Ciudad: ${hero.city}</div>
        </div>
        
        <!-- Mascota -->
        <div style="text-align: center;">
          <h3>Tu Mascota</h3>
          <div style="margin-bottom: 15px;">
            ${getPetSVG(adoptedPet.type)}
          </div>
          <div>
            <strong>${adoptedPet.name}</strong> (${adoptedPet.type})
          </div>
        </div>
      </div>
      
      <!-- Estadísticas de la mascota -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3>Estadísticas de ${adoptedPet.name}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="text-align: center;">
            <div style="font-size: 24px;">🍽️</div>
            <div><strong>Hambre:</strong></div>
            <div id="hambreStat">${adoptedPet.hambre || 50}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px;">🚿</div>
            <div><strong>Higiene:</strong></div>
            <div id="higieneStat">${adoptedPet.higiene || 50}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px;">🏃</div>
            <div><strong>Energía:</strong></div>
            <div id="energiaStat">${adoptedPet.energia || 50}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px;">💊</div>
            <div><strong>Salud:</strong></div>
            <div id="saludStat">${adoptedPet.salud || 50}</div>
          </div>
        </div>
      </div>
      
      <!-- Acciones -->
      <div style="text-align: center;">
        <h3>Acciones con tu mascota</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 15px;">
          <button class="btn" onclick="performPetActionAction(${adoptedPet.id}, 'alimentar')" style="background: #FF9800;">
            🍽️ Alimentar
          </button>
          <button class="btn" onclick="performPetActionAction(${adoptedPet.id}, 'banar')" style="background: #2196F3;">
            🚿 Bañar
          </button>
          <button class="btn" onclick="performPetActionAction(${adoptedPet.id}, 'pasear')" style="background: #4CAF50;">
            🏃 Pasear
          </button>
          <button class="btn" onclick="performPetActionAction(${adoptedPet.id}, 'curar')" style="background: #F44336;">
            💊 Curar
          </button>
        </div>
      </div>
      
      <div id="actionMsg" class="msg" style="margin-top: 20px;"></div>
    `;
    
  } catch (error) {
    section.innerHTML = `
      <div class="msg" style="color: #e57373; text-align: center; margin: 20px;">
        Error al cargar datos: ${error.message}
      </div>
    `;
  }
};

// Función para manejar las acciones de la mascota
window.performPetActionAction = async function(petId, action) {
  try {
    const result = await performPetAction(petId, action);
    
    const actionNames = {
      'alimentar': 'Alimentar',
      'banar': 'Bañar',
      'pasear': 'Pasear',
      'curar': 'Curar',
      'revivir': 'Revivir'
    };
    
    // Mostrar mensaje de éxito
    if (typeof showMessage === 'function') {
      showMessage(`¡${actionNames[action]} exitoso! 🎉`, 'success');
    } else {
      // Fallback para páginas sin función showMessage
      const msgDiv = document.getElementById('actionMsg');
      if (msgDiv) {
        msgDiv.style.color = '#43cea2';
        msgDiv.textContent = `¡${actionNames[action]} exitoso! 🎉`;
        setTimeout(() => { msgDiv.textContent = ''; }, 2000);
      }
    }
    
    // Actualizar estadísticas en la interfaz de Pou
    if (result.pet) {
      // Buscar la función de actualización con animación si existe
      if (typeof updatePouStatsWithAnimation === 'function') {
        updatePouStatsWithAnimation(result.pet);
      } else {
        updatePouStats(result.pet);
      }
    }
    
    // Actualizar estadísticas en la interfaz antigua (si existe)
    const hambreStat = document.getElementById('hambreStat');
    const higieneStat = document.getElementById('higieneStat');
    const energiaStat = document.getElementById('energiaStat');
    const saludStat = document.getElementById('saludStat');
    
    if (hambreStat) hambreStat.textContent = result.pet.hambre || 50;
    if (higieneStat) higieneStat.textContent = result.pet.higiene || 50;
    if (energiaStat) energiaStat.textContent = result.pet.energia || 50;
    if (saludStat) saludStat.textContent = result.pet.salud || 50;
    
  } catch (error) {
    console.error('Error en acción de mascota:', error);
    
    let errorMessage = `Error al ${action}: ${error.message}`;
    
    // Mensajes más específicos según el tipo de error
    if (error.message.includes('Error 400')) {
      errorMessage = `Error de validación: Verifica que la mascota esté adoptada y no esté muerta.`;
    } else if (error.message.includes('Error 401')) {
      errorMessage = `Error de autenticación: Por favor, inicia sesión nuevamente.`;
    } else if (error.message.includes('Error 404')) {
      errorMessage = `Mascota no encontrada.`;
    } else if (error.message.includes('Error 500')) {
      errorMessage = `Error del servidor: Intenta nuevamente más tarde.`;
    }
    
    if (typeof showMessage === 'function') {
      showMessage(errorMessage, 'error');
    } else {
      const msgDiv = document.getElementById('actionMsg');
      if (msgDiv) {
        msgDiv.style.color = '#e57373';
        msgDiv.textContent = errorMessage;
      }
    }
  }
};

// Función para actualizar estadísticas en la interfaz de Pou
function updatePouStats(pet) {
  const healthBar = document.querySelector('.progress-bar.health');
  const hungerBar = document.querySelector('.progress-bar.hunger');
  const hygieneBar = document.querySelector('.progress-bar.hygiene');
  const happinessBar = document.querySelector('.progress-bar.happiness');
  
  if (healthBar) {
    healthBar.style.width = `${pet.salud || 50}%`;
    healthBar.nextElementSibling.textContent = `${pet.salud || 50}%`;
  }
  
  if (hungerBar) {
    hungerBar.style.width = `${pet.hambre || 50}%`;
    hungerBar.nextElementSibling.textContent = `${pet.hambre || 50}%`;
  }
  
  if (hygieneBar) {
    hygieneBar.style.width = `${pet.limpieza || 50}%`;
    hygieneBar.nextElementSibling.textContent = `${pet.limpieza || 50}%`;
  }
  
  if (happinessBar) {
    happinessBar.style.width = `${pet.felicidad || 50}%`;
    happinessBar.nextElementSibling.textContent = `${pet.felicidad || 50}%`;
  }
  
  // Actualizar indicadores de estado
  const petStatus = document.getElementById('petStatus');
  if (petStatus) {
    const statusBar = petStatus.querySelector('.status-bar');
    if (statusBar) {
      // Remover indicadores anteriores
      const oldIndicators = petStatus.querySelectorAll('.status-bar + div');
      oldIndicators.forEach(indicator => indicator.remove());
      
      // Agregar nuevos indicadores
      if (pet.enfermo) {
        const enfermoDiv = document.createElement('div');
        enfermoDiv.style.cssText = 'color: #f44336; text-align: center; margin-top: 10px; font-weight: bold;';
        enfermoDiv.textContent = '🤒 Enfermo';
        petStatus.appendChild(enfermoDiv);
      }
      
      if (pet.muerta) {
        const muertaDiv = document.createElement('div');
        muertaDiv.style.cssText = 'color: #f44336; text-align: center; margin-top: 10px; font-weight: bold;';
        muertaDiv.textContent = '💀 Muerta';
        petStatus.appendChild(muertaDiv);
      }
    }
  }
}

// Renderizar sección de mascotas
window.renderMascotasSection = async function() {
  const section = document.getElementById('mascotasSection');
  section.innerHTML = '';
  const pets = await fetchPets();
  if (pets.length === 0) {
    section.innerHTML = `<form id="petForm">
      <div class="form-group"><label>Nombre</label><input type="text" id="petName" required></div>
      <div class="form-group">
        <label>Tipo de mascota</label>
        <select id="petType" required>
          <option value="">Selecciona un tipo</option>
          <option value="perro">🐕 Perro</option>
          <option value="gato">🐱 Gato</option>
          <option value="conejo">🐰 Conejo</option>
          <option value="caballo">🐎 Caballo</option>
          <option value="cochino">🐷 Cochino</option>
        </select>
      </div>
      <button class="btn" type="submit">Crear Mascota</button>
      <div id="petMsg" class="msg"></div>
    </form>`;
    document.getElementById('petForm').onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('petName').value.trim();
      const type = document.getElementById('petType').value;
      const msgDiv = document.getElementById('petMsg');
      msgDiv.textContent = '';
      const res = await createPet({ name, type });
      if (res._id || res.id) {
        msgDiv.style.color = '#43cea2';
        msgDiv.textContent = '¡Mascota creada!';
        setTimeout(() => window.renderMascotasSection(), 1000);
      } else {
        msgDiv.style.color = '#d32f2f';
        msgDiv.textContent = res.error || 'Error al crear mascota.';
      }
    };
    return;
  }
  // Mostrar la primera mascota (puedes expandir para varias)
  const pet = pets[0];
  section.innerHTML = `
    <div style="margin-bottom:16px;">
      ${getPetSVG(pet.type)}
      <div><b>${pet.name}</b> (<i>${pet.type}</i>)</div>
      <div>ID: ${pet.id}</div>
    </div>
  `;
};

// Hook para cargar la sección de mascotas cuando se navega
if (document.getElementById('mascotasSection')) {
  window.renderMascotasSection();
}
// Puedes llamar window.renderMascotasSection() desde el HTML cuando cambies de sección 