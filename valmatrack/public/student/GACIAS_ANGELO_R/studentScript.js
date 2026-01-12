// ========================================
// VALMATRACK - STUDENT SCRIPT
// ========================================

// ========================================
// STREAK SYSTEM
// ========================================
const STREAK_RULES = {
    NONE: { min: 0, max: 2, icon: null },
    YELLOW: { min: 3, max: 10, icon: '../../assets/ys.jpg' },
    ORANGE: { min: 11, max: 20, icon: '../../assets/os.jpg' },
    RED: { min: 21, max: 50, icon: '../../assets/rs.jpg' },
    PURPLE: { min: 51, max: 70, icon: '../../assets/ps.jpg' },
    VIOLET: { min: 71, max: 100, icon: '../../assets/vs.jpg' }
};

function getStreakIcon(streakDays) {
    if (streakDays <= STREAK_RULES.NONE.max) {
        return null; // No streak
    } else if (streakDays >= STREAK_RULES.YELLOW.min && streakDays <= STREAK_RULES.YELLOW.max) {
        return STREAK_RULES.YELLOW.icon;
    } else if (streakDays >= STREAK_RULES.ORANGE.min && streakDays <= STREAK_RULES.ORANGE.max) {
        return STREAK_RULES.ORANGE.icon;
    } else if (streakDays >= STREAK_RULES.RED.min && streakDays <= STREAK_RULES.RED.max) {
        return STREAK_RULES.RED.icon;
    } else if (streakDays >= STREAK_RULES.PURPLE.min && streakDays <= STREAK_RULES.PURPLE.max) {
        return STREAK_RULES.PURPLE.icon;
    } else if (streakDays >= STREAK_RULES.VIOLET.min) {
        return STREAK_RULES.VIOLET.icon;
    }
    return null;
}

function updateStreakDisplay(streakDays) {
    const streakIcon = getStreakIcon(streakDays);
    
    // Update all streak numbers
    const streakNumbers = document.querySelectorAll('#streakNumber, #profileStreakNumber');
    streakNumbers.forEach(element => {
        element.textContent = streakDays;
    });
    
    // Update all streak icons
    const streakIcons = document.querySelectorAll('#streakIcon, #profileStreakIcon');
    streakIcons.forEach(element => {
        if (streakIcon) {
            element.src = streakIcon;
            element.style.display = 'block';
        } else {
            element.style.display = 'none'; // Hide icon if no streak
        }
    });
}

// Check if student is late (after 7:00 AM)
function isLate(timeString) {
    const time = new Date('1970-01-01 ' + timeString);
    const cutoff = new Date('1970-01-01 07:00:00');
    return time > cutoff;
}

// ========================================
// SIDEBAR TOGGLE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Initialize based on current page
    initializePage();
});

// ========================================
// PAGE INITIALIZATION
// ========================================
function initializePage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    // Update active menu item
    updateActiveMenu(page);
    
    // Initialize page-specific features
    if (page === 'studentHome.html' || page === '') {
        initializeHomePage();
    } else if (page === 'studentCalendar.html') {
        initializeCalendarPage();
    } else if (page === 'studentSettings.html') {
        initializeSettingsPage();
    }
    
    // Common initializations
    initializeSearch();
    
    // Example: Set streak to 15 days (you would fetch this from backend)
    const currentStreak = 7; // This should come from your backend/database
    updateStreakDisplay(currentStreak);
}

// ========================================
// MENU ACTIVE STATE
// ========================================
function updateActiveMenu(currentPage) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const href = link.getAttribute('href');
        
        item.classList.remove('active');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'studentHome.html')) {
            item.classList.add('active');
        }
    });
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const closeSearch = document.querySelector('.close-search');
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim()) {
        console.log('Searching for:', query);
        // Add your search logic here
    }
}

// ========================================
// HOME PAGE
// ========================================
function initializeHomePage() {
    generateAttendanceRecords();
    updateStatusCards();
}

function generateAttendanceRecords() {
    const container = document.getElementById('attendanceRecords');
    if (!container) return;
    
    const records = [
        { day: 1, weekday: 'Mon', timeIn: '6:19 AM', timeOut: '3:15 PM', totalHours: '8h 56m' },
        { day: 2, weekday: 'Tue', timeIn: '7:03 AM', timeOut: '4:15 PM', totalHours: '9h 12m' },
        { day: 3, weekday: 'Wed', timeIn: '6:49 AM', timeOut: '4:15 PM', totalHours: '9h 26m' },
        { day: 4, weekday: 'Thu', timeIn: '6:52 AM', timeOut: '4:00 PM', totalHours: '9h 08m' },
        { day: 5, weekday: 'Fri', timeIn: '6:49 AM', timeOut: '4:00 PM', totalHours: '9h 11m' }
    ];
    
    container.innerHTML = '';
    
    records.forEach((record, index) => {
        const item = document.createElement('div');
        item.className = 'attendance-item';
        item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        
        item.innerHTML = `
            <div class="attendance-date">
                <div class="date-number">${String(record.day).padStart(2, '0')}</div>
                <div class="date-day">${record.weekday}</div>
            </div>
            
            <div class="time-block">
                <img src="../../assets/c.jpg" alt="Clock" class="time-icon">
                <div class="time-value">${record.timeIn}</div>
                <div class="time-label">Time-in</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="time-block">
                <img src="../../assets/c.jpg" alt="Clock" class="time-icon">
                <div class="time-value">${record.timeOut}</div>
                <div class="time-label">Time-out</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="time-block">
                <img src="../../assets/c.jpg" alt="Clock" class="time-icon">
                <div class="time-value">${record.totalHours}</div>
                <div class="time-label">Total Hours</div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

function updateStatusCards() {
    const onTime = 5;
    const late = 4;
    const absent = 0;
    const excused = 0;

    const onTimeEl = document.getElementById('onTimeCount');
    const absentEl = document.getElementById('absentCount');
    const excusedEl = document.getElementById('excusedCount');
    const lateEl = document.getElementById('lateCount');

    if (onTimeEl) onTimeEl.textContent = onTime;
    if (absentEl) absentEl.textContent = absent;
    if (excusedEl) excusedEl.textContent = excused;
    if (lateEl) lateEl.textContent = late;
}


// ========================================
// CALENDAR PAGE
// ========================================
function initializeCalendarPage() {
    generateCalendarGrid();
    generateCalendarRecords();
    updateCalendarInfo();
}

function generateCalendarGrid() {
    const tbody = document.getElementById('calendarBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const totalDays = 31; // December
    let dayCounter = 1;

    for (let week = 0; week < 7; week++) {
        const row = document.createElement('tr');

        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const cell = document.createElement('td');

            if (dayCounter <= totalDays) {
                cell.textContent = dayCounter;

                // Highlight Dec 1–12
                if (dayCounter >= 1 && dayCounter <= 12) {
                    if (dayCounter === 6 || dayCounter === 7 || dayCounter === 8) {
                        cell.classList.add('no-box'); // Dec 6, 7 are no classes
                        cell.title = 'No Class';
                    } 
                    if (dayCounter === 2) {
                        cell.classList.add('late-box'); // Dec 2 is late
                        cell.title = 'Late';
                    }
                    else {
                        cell.classList.add('on-time-box'); // Others are on time
                        cell.title = 'On Time';
                    }
                }

                dayCounter++;
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
}

function generateCalendarRecords() {
    const container = document.getElementById('recordsList');
    if (!container) return;

    const records = [];

    // December 1–9
    for (let day = 1; day <= 12; day++) {
        records.push({
            date: `December ${day}:`,
            time: day === 2 ? 'Late' : day === 6 || day === 7 || day === 8 ? 'No Class' : 'On Time'
        });
    }

    // Remaining days (13–31) as placeholders
    for (let day = 13; day <= 31; day++) {
        records.push({
            date: `December ${day}:`,
            time: '———'
        });
    }
    container.innerHTML = '';
    
    records.forEach((record, index) => {
        const item = document.createElement('div');
        item.className = 'record-item';
        item.style.animation = `fadeInLeft 0.4s ease ${index * 0.05}s both`;
        
        item.innerHTML = `
            <img src="../../assets/c.jpg" alt="Clock" class="record-icon">
            <div>
                <div class="record-date">${record.date}</div>
                <div class="record-time">${record.time}</div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// ========================================
// SETTINGS PAGE
// ========================================
function initializeSettingsPage() {
    const accountToggle = document.getElementById('accountToggle');
    const accountDropdown = document.getElementById('accountDropdown');
    
    if (accountToggle && accountDropdown) {
        accountToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            accountDropdown.classList.toggle('show');
        });
    }
    
    // Add confirmation for logout
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                // Redirect to login page
                window.location.href = '../../index.html';
            }
        });
    }
}

// ========================================
// NOTIFICATION HANDLING
// ========================================
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        alert('You have 3 new notifications!\n\n1. Attendance marked: On time\n2. Weekly report available\n3. System update');
        // In production, this would open a notification panel
    });
}

// ========================================
// MENU DOTS HANDLING
// ========================================
const menuDots = document.querySelector('.menu-dots');
if (menuDots) {
    menuDots.addEventListener('click', function() {
        const options = ['Profile', 'Settings', 'Help', 'About'];
        const choice = prompt('Quick Menu:\n1. Profile\n2. Settings\n3. Help\n4. About\n\nEnter number:');
        
        switch(choice) {
            case '1':
                window.location.href = 'studentProfile.html';
                break;
            case '2':
                window.location.href = 'studentSettings.html';
                break;
            case '3':
                alert('Help: Contact admin@valmatrack.com for support');
                break;
            case '4':
                alert('VALMAtrack v1.0\nRFID Attendance System\n© 2025');
                break;
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format time
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Calculate time difference
function calculateTimeDiff(start, end) {
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

// Get current week number
function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    
    return Math.ceil(diff / oneWeek);
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.status-card, .summary-box, .right-panel');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Call animation on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// ========================================
// PAGE TRANSITION EFFECTS
// ========================================
document.querySelectorAll('a').forEach(link => {
    if (link.hostname === window.location.hostname) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't animate if it's just a hash link
            if (href && href !== '#' && !href.startsWith('#')) {
                e.preventDefault();
                
                // Fade out effect
                document.body.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    }
});

// Add fade in/out animations
const transitionStyle = document.createElement('style');
transitionStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    body {
        animation: fadeIn 0.4s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(transitionStyle);

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================
console.log('%cVALMAtrack Student Portal', 'color: #800000; font-size: 24px; font-weight: bold;');
console.log('%cVersion 1.0 | RFID Attendance System', 'color: #666; font-size: 14px;');
console.log('%c© 2025 All Rights Reserved', 'color: #999; font-size: 12px;');
console.log('%c\nStreak Rules:', 'color: #800000; font-weight: bold;');
console.log('%c3-10 days = Yellow Streak', 'color: #f1c40f;');
console.log('%c11-20 days = Orange Streak', 'color: #e67e22;');
console.log('%c21-50 days = Red Streak', 'color: #e74c3c;');
console.log('%c51-70 days = Purple Streak', 'color: #9b59b6;');
console.log('%c71-100 days = Violet Streak', 'color: #8e44ad;');
console.log('%c⚠ Absent or Late (past 7:00 AM) = Lose Streak!', 'color: #e74c3c; font-weight: bold;');

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ========================================
// EXAMPLE: STREAK TESTING
// ========================================
// Uncomment to test different streak levels
/*
setTimeout(() => {
    console.log('Testing streak levels...');
    updateStreakDisplay(2);  // No streak
    setTimeout(() => updateStreakDisplay(5), 1000);  // Yellow
    setTimeout(() => updateStreakDisplay(15), 2000); // Orange
    setTimeout(() => updateStreakDisplay(30), 3000); // Red
    setTimeout(() => updateStreakDisplay(60), 4000); // Purple
    setTimeout(() => updateStreakDisplay(80), 5000); // Violet
}, 2000);
*/

/* ROUTER ADDED BY merge_students.js */
function showSection(id) {
  document.querySelectorAll('.page').forEach(s => s.style.display = 'none');
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

function initRouter() {
  function route() {
    const hash = (location.hash || '#home').replace('#','');
    showSection(hash || 'home');
  }
  window.addEventListener('hashchange', route);
  route();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}
