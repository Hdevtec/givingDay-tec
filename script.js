// 1. MATRIZ DE DATOS UNIFICADA (13 CAMPUS EN TOTAL)
const campusData = [
    { name: "Monterrey", short: "MTY", region: "Campus Norte • Líder", donors: 1842, total: 2400000, maxGoal: 2500000 },
    { name: "Guadalajara", short: "GDL", region: "Campus Occidente", donors: 1456, total: 1870000, maxGoal: 2500000 },
    { name: "Ciudad de México", short: "CDMX", region: "Campus Centro", donors: 1188, total: 1560000, maxGoal: 2500000 },
    { name: "Matamoros", short: "MTM", region: "Campus Noreste", donors: 912, total: 1220000, maxGoal: 2500000 },
    { name: "San Luis Potosí", short: "SLP", region: "Campus Centro-Norte", donors: 743, total: 978000, maxGoal: 2500000 },
    { name: "Puebla", short: "PUE", region: "Campus Centro", donors: 578, total: 754000, maxGoal: 2500000 },
    { name: "Querétaro", short: "QRO", region: "Campus Centro-Sur", donors: 492, total: 640000, maxGoal: 2500000 },
    { name: "Estado de México", short: "CEM", region: "Campus Zona Metropolitana", donors: 415, total: 580000, maxGoal: 2500000 },
    { name: "Toluca", short: "TOL", region: "Campus Centro", donors: 388, total: 495000, maxGoal: 2500000 },
    { name: "Chihuahua", short: "CHI", region: "Campus Norte", donors: 310, total: 412000, maxGoal: 2500000 },
    { name: "Laguna", short: "LAG", region: "Campus Norte", donors: 285, total: 360000, maxGoal: 2500000 },
    { name: "Sinaloa", short: "SIN", region: "Campus Noroeste", donors: 195, total: 245000, maxGoal: 2500000 },
    { name: "Saltillo", short: "SAL", region: "Campus Norte", donors: 120, total: 158000, maxGoal: 2500000 }
];

// VARIABLES PARA LOS MARCADORES GLOBALES (HERO)
let currentMoney = 11447000; 
const goalMoney = 15000000;
let currentDonors = 8424;

const mensajes = [
    "Juan P. donó $500", "Beca Líderes: +$1,000", "Campus MTY: +$5,000",
    "Ana L. envió un mensaje de apoyo", "EXATEC: +$2,500", "Nueva meta alcanzada"
];

// 2. DISPARADOR PRINCIPAL UNIFICADO
document.addEventListener("DOMContentLoaded", () => {
    // Ejecuciones iniciales al cargar la pantalla
    actualizarVistaHero();
    renderLeaderboard();
    initMuro();
    
    // Un solo intervalo activo para simular donaciones en vivo cada 4 segundos
    setInterval(() => {
        const montoAleatorio = Math.floor(Math.random() * 1500) + 200;
        currentMoney += montoAleatorio;
        currentDonors += 1;
        
        // Sumar también a un campus aleatorio para mover el Leaderboard
        const campusAleatorio = campusData[Math.floor(Math.random() * campusData.length)];
        campusAleatorio.donors += 1;
        campusAleatorio.total += montoAleatorio;
        
        // Refrescar los elementos visuales
        actualizarVistaHero();
        renderLeaderboard();
    }, 4000);
});

// 3. ACTUALIZA LOS CONTADORES DEL HERO
function actualizarVistaHero() {
    const moneyEl = document.getElementById("money-counter");
    const donorsEl = document.getElementById("donors-counter");
    const barEl = document.getElementById("progress-bar");
    const percentEl = document.getElementById("progress-percent");

    if (moneyEl) moneyEl.innerText = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(currentMoney);
    if (donorsEl) donorsEl.innerText = currentDonors.toLocaleString('es-MX');
    
    let percent = (currentMoney / goalMoney) * 100;
    if (barEl) barEl.style.width = Math.min(percent, 100) + "%";
    if (percentEl) percentEl.innerText = Math.min(percent, 100).toFixed(1) + "%";
}

// 4. RENDERIZA EL LEADERBOARD PREMIUM CON LAS MEDALLAS
function renderLeaderboard() {
    const container = document.getElementById("dynamic-leaderboard");
    if (!container) return; 
    
    container.innerHTML = "";
    
    // Ordenar dinámicamente de mayor a menor dinero recaudado
    campusData.sort((a, b) => b.total - a.total);
    
    campusData.forEach((campus, index) => {
        const position = index + 1;
        
        // Asignación de medallas para el Top 3
        let positionVisual = position;
        if (position === 1) positionVisual = '<span class="medal-icon">🥇</span>';
        else if (position === 2) positionVisual = '<span class="medal-icon">🥈</span>';
        else if (position === 3) positionVisual = '<span class="medal-icon">🥉</span>';
        
        // Conversión a formato corto ($2.4M o $978K)
        let formattedTotal = "";
        if (campus.total >= 1000000) {
            formattedTotal = `$${(campus.total / 1000000).toFixed(2)}M`;
        } else {
            formattedTotal = `$${Math.floor(campus.total / 1000).toString()}K`;
        }
        
        // Calcular porcentaje de su barra interna
        const progressPercent = Math.min((campus.total / campus.maxGoal) * 100, 100);
        
        // Aplicar clase especial al primer lugar
        const rowClass = position === 1 ? "lb-row leader-first" : "lb-row";
        
        const rowHTML = `
            <div class="${rowClass}">
                <div class="col-num">${positionVisual}</div>
                <div class="col-campus">
                    <div class="campus-badge">${campus.short}</div>
                    <div class="campus-info">
                        <span class="campus-name">${campus.name}</span>
                        <span class="campus-region">${campus.region}</span>
                    </div>
                </div>
                <div class="col-progress">
                    <div class="row-progress-container">
                        <div class="row-progress-bg">
                            <div class="row-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                    <span class="donors-count">${campus.donors.toLocaleString('es-MX')} donantes</span>
                </div>
                <div class="col-total">${formattedTotal}</div>
            </div>
        `;
        container.innerHTML += rowHTML;
    });
}

// 5. MURO DE AGRADECIMIENTO
function initMuro() {
    const muro = document.getElementById("muro-feed");
    if (!muro) return;
    const content = mensajes.map(m => `<span class="muro-tag">${m}</span>`).join("");
    muro.innerHTML = content + content;
}

// FUNCIONES DE SCROLL
function scrollDonar() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollLideres() {
    const el = document.getElementById("lideres");
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// NUEVA LISTA DE DONANTES CON ATRIBUTO DE TIPO
const donantesMuro = [
    { nombre: "Familia Gutiérrez Zamora", tipo: "persona" },
    { nombre: "Femsa Corporativo", tipo: "empresa" },
    { nombre: "Ing. Alejandro Ruiz (EXATEC)", tipo: "persona" },
    { nombre: "Cemex México", tipo: "empresa" },
    { nombre: "Sofía Rodríguez Mercado", tipo: "persona" },
    { nombre: "Grupo Bimbo", tipo: "empresa" },
    { nombre: "Dr. Santos Valenzuela", tipo: "persona" },
    { nombre: "Fundación Banorte", tipo: "empresa" }
];

// Reemplaza por completo tu función initMuro() por esta con la lógica de emojis:
function initMuro() {
    const muro = document.getElementById("muro-feed");
    if (!muro) return;
    
    // Mapeamos los objetos evaluando el tipo para concatenar el emoji correcto
    const content = donantesMuro.map(donante => {
        const emoji = donante.tipo === "empresa" ? "🏢" : "👤";
        return `<span class="muro-tag">${emoji} ${donante.nombre}</span>`;
    }).join("");
    
    // Duplicamos el contenido para el efecto de bucle infinito sin saltos
    muro.innerHTML = content + content;
}