// --- 1. DYNAMIC DATA GENERATION ---
function getRelDate(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

const eventsData = [
    { id: 1, title: "Cyber-Security Hackathon", date: getRelDate(10), time: "09:00", type: "Tech",  image: "./img1.jpg", desc: "A 24-hour intense coding challenge. Teams will defend servers against AI attacks.", venue: "Main Computer Lab" },
    { id: 2, title: "Robotics Championship", date: getRelDate(15), time: "11:00", type: "Tech", image: "./img2.jpg", desc: "Inter-school robot wars. Battle bots and maze solvers competition.", venue: "Gymnasium Arena" },
    { id: 3, title: "Neon Art Exhibit", date: getRelDate(20), time: "10:00", type: "Art",  image: "./img3.jpg", desc: "Digital and light art showcase featuring student projection mapping projects.", venue: "Arts Wing Gallery" },
    { id: 4, title: "Space Science Debate", date: getRelDate(25), time: "18:00", type: "Academic",  image: "./img4.jpg", desc: "Topic: 'Should we colonize Mars before fixing Earth?'.", venue: "Auditorium" }
];

const announcements = [
    { title: "Susara Audtions", date: "29 - Monday", text: "Any student can showcase their talent on the stage! join with the vocal/instrumental auditions on 29th Monday from 8 a.m. onwards." },
    { title: "Science society wins the trophy on Esfect'25 ", date: "16 - Thursday", text: "Science quiz team praticipated in the semi finals of Esfect'25 - Annual Science day of Vidyartha College and won the championship. " }
];

// --- 2. INITIALIZATION ROUTER ---
document.addEventListener('DOMContentLoaded', () => {
    // Nav Active State
    const page = window.location.pathname.split("/").pop() || 'index.html';
    const link = document.querySelector(`.nav-links a[href*='${page}']`);
    if(link) link.classList.add('active');

    if (document.getElementById('home-root')) initHome();
    if (document.getElementById('events-root')) initEventsPage();
    if (document.getElementById('calendar-root')) initCalendarPage();
    if (document.getElementById('news-root')) initNewsPage();
    if (document.getElementById('register-root')) initRegisterPage();

    setupModal();
});

// --- 3. PAGE SPECIFIC LOGIC ---

function initHome() {
    const container = document.getElementById('featured-events');
    eventsData.slice(0, 2).forEach(event => container.innerHTML += createCardHTML(event));
    
    // Countdown Logic
    const nextEvent = eventsData.sort((a,b) => new Date(a.date) - new Date(b.date)).find(e => new Date(e.date + 'T' + e.time) > new Date());
    if (nextEvent) {
        document.getElementById('next-event-name').innerText = nextEvent.title;
        startCountdown(nextEvent.date + "T" + nextEvent.time);
    } else {
        document.getElementById('next-event-name').innerText = "No Upcoming Events";
        document.getElementById('timer-display').innerText = "00:00:00";
    }
}

function startCountdown(targetISO) {
    const target = new Date(targetISO).getTime();
    setInterval(() => {
        const diff = target - new Date().getTime();
        if (diff < 0) { document.getElementById('timer-display').innerText = "LIVE NOW"; return; }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('timer-display').innerText = `${d}d : ${h}h : ${m}m : ${s}s`;
    }, 1000);
}

function initEventsPage() {
    const grid = document.getElementById('events-grid');
    const filter = document.getElementById('type-filter');
    function render(type = 'all') {
        grid.innerHTML = '';
        const data = type === 'all' ? eventsData : eventsData.filter(e => e.type === type);
        data.forEach(e => grid.innerHTML += createCardHTML(e));
    }
    render();
    filter.addEventListener('change', (e) => render(e.target.value));
}

function initCalendarPage() {
    let currMonth = new Date().getMonth();
    let currYear = new Date().getFullYear();
    renderCalendar(currMonth, currYear);

    document.getElementById('prevMonth').onclick = () => { currMonth--; if(currMonth < 0) { currMonth=11; currYear--; } renderCalendar(currMonth, currYear); };
    document.getElementById('nextMonth').onclick = () => { currMonth++; if(currMonth > 11) { currMonth=0; currYear++; } renderCalendar(currMonth, currYear); };
}

function renderCalendar(month, year) {
    const grid = document.getElementById('calendar-grid');
    document.getElementById('month-label').innerText = `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month]} ${year}`;
    grid.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

    for(let i=1; i<=daysInMonth; i++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.innerHTML = `<span>${i}</span>`;
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        const match = eventsData.filter(e => e.date === dateStr);
        if(match.length > 0) {
            cell.classList.add('active-event');
            match.forEach(() => cell.innerHTML += `<span class="event-dot"></span>`);
            cell.onclick = () => {
                const info = document.getElementById('date-info');
                info.innerHTML = `<h3 style="color:var(--neon-blue)">${dateStr}</h3>`;
                match.forEach(m => info.innerHTML += `<div style="margin-top:15px; border-left:2px solid var(--neon-purple); padding-left:10px;"><strong>${m.title}</strong><br><span style="font-size:0.9rem; color:#aaa">${m.time}</span><br><button class="btn-ghost" style="margin-top:5px; padding:5px;" onclick="openDetailsModal(${m.id})">Info</button></div>`);
            };
        }
        if(i === new Date().getDate() && month === new Date().getMonth()) cell.classList.add('today');
        grid.appendChild(cell);
    }
}

function initNewsPage() {
    const list = document.getElementById('news-list');
    announcements.forEach(a => {
        list.innerHTML += `<div style="background:var(--bg-panel); padding:20px; border-left:4px solid var(--neon-blue); margin-bottom:15px;"><h3 style="margin:0">${a.title}</h3><small style="color:var(--neon-blue)">${a.date}</small><p style="margin-top:10px; color:#ccc;">${a.text}</p></div>`;
    });
}

// --- NEW: REGISTRATION PAGE LOGIC ---
function initRegisterPage() {
    const select = document.getElementById('event-select');
    // Fill Dropdown
    eventsData.forEach(e => {
        const option = document.createElement('option');
        option.value = e.title;
        option.innerText = `${e.title} (${e.date})`;
        select.appendChild(option);
    });

    // Handle Submit
    document.getElementById('ticket-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('ticket-form').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
    });
}

// --- SHARED: HELPERS ---
function createCardHTML(e) {
    return `
        <div class="card">
            <img src="${e.image}" alt="${e.title}">
            <div class="card-body">
                <span style="color:var(--neon-blue); font-size:0.8rem; text-transform:uppercase; border:1px solid var(--neon-blue); padding:2px 6px;">${e.type}</span>
                <span class="card-date" style="margin-top:10px;">${e.date} @ ${e.time}</span>
                <h3>${e.title}</h3>
                <button class="btn-ghost" onclick="openDetailsModal(${e.id})">View Protocol</button>
            </div>
        </div>
    `;
}

// --- MODAL SYSTEM ---
function setupModal() {
    if (!document.getElementById('global-modal')) {
        const modalHTML = `
            <div id="global-modal" class="modal-overlay">
                <div class="modal-content" id="modal-inner-content">
                    <!-- Dynamic Content Loaded Here -->
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Close on click outside
        const modal = document.getElementById('global-modal');
        window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };
    }
}

function openDetailsModal(id) {
    const event = eventsData.find(e => e.id === id);
    const modalContent = document.getElementById('modal-inner-content');
    
    // Normal Details View
    modalContent.innerHTML = `
        <span class="close-modal" onclick="document.getElementById('global-modal').style.display='none'">&times;</span>
        <h2 style="color:var(--neon-blue); margin-bottom:10px;">${event.title}</h2>
        <img src="${event.image}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; margin-bottom:15px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:0.9rem; color:#aaa;">
            <span>${event.date} @ ${event.time}</span>
            <span>Loc: ${event.venue}</span>
        </div>
        <p style="line-height:1.6; color:#e0e6ed; margin-bottom:20px;">${event.desc}</p>
        <button class="btn-neon" style="width:100%;" onclick="switchModalToRegister('${event.title}')">Register Now</button>
    `;
    
    document.getElementById('global-modal').style.display = 'flex';
}

// NEW: Switch Modal content to Registration Form
function switchModalToRegister(eventTitle) {
    const modalContent = document.getElementById('modal-inner-content');
    
    modalContent.innerHTML = `
        <span class="close-modal" onclick="document.getElementById('global-modal').style.display='none'">&times;</span>
        <h2 style="color:var(--neon-purple); margin-bottom:20px;">Quick Register</h2>
        <p style="color:#aaa; margin-bottom:20px;">Registering for: <strong style="color:white">${eventTitle}</strong></p>
        
        <form onsubmit="alert('Access Granted. Check your email.'); document.getElementById('global-modal').style.display='none'; return false;">
            <div style="margin-bottom:15px;">
                <label style="display:block; color:var(--neon-blue); font-size:0.8rem; margin-bottom:5px;">Name</label>
                <input type="text" class="form-input" required placeholder="Cadet Name">
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; color:var(--neon-blue); font-size:0.8rem; margin-bottom:5px;">Email</label>
                <input type="email" class="form-input" required placeholder="Comm Link">
            </div>
            <button type="submit" class="btn-neon" style="width:100%;">Confirm Entry</button>
        </form>
    `;
}