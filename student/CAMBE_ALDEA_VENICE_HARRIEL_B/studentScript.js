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
    // Determine current section from hash (default to home)
    const hash = (location.hash || '#home').replace('#','');
    const page = hash || 'home';

    // Update active menu item
    updateActiveMenu(page);

    // Initialize page-specific features
    if (page === 'home') {
        initializeHomePage();
    } else if (page === 'calendar') {
        initializeCalendarPage();
    } else if (page === 'settings') {
        initializeSettingsPage();
    } else if (page === 'profile') {
        // profile-specific init (if any)
    }

    // Common initializations
    initializeSearch();

    // Example: Set streak to a placeholder (should come from backend)
    const currentStreak = 9; // Replace with backend value where applicable
    updateStreakDisplay(currentStreak);
}


// ========================================
// MENU ACTIVE STATE
// ========================================
function updateActiveMenu(currentSection) {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;
        const href = link.getAttribute('href');

        item.classList.remove('active');

        // Normalize href (could be '#home' or './studentHome.html' in older copies)
        if (href === '#' + currentSection || (currentSection === 'home' && (href === '#home' || href.includes('studentHome.html')))) {
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
        { day: 2, weekday: 'Tue', timeIn: '6:53 AM', timeOut: '4:15 PM', totalHours: '9h 22m' },
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
    const onTime = 9;
    const late = 0;
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
                    if (dayCounter === 6 || dayCounter ===  7 || dayCounter === 8) {
                        cell.classList.add('no-box'); // Dec 6, 7, 8 are no classes
                        cell.title = 'No Class';
                    } 
                    if (dayCounter === 3 || dayCounter === 10 || dayCounter === 12) {
                        cell.classList.add('on-time-box'); // Dec 3, 10, and 12 are on time
                        cell.title = 'On Time';
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
            time: day === 3 || day === 10 || day === 12 ? 'On Time' : day === 6 || day === 7 || day === 8 ? 'No Class' : 'On Time'
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
        const choice = prompt('Quick Menu:
1. Profile
2. Settings
3. Help
4. About

Enter number:');
        switch(choice) {
            case '1':
                location.hash = '#profile';
                break;
            case '2':
                location.hash = '#settings';
                break;
            case '3':
                alert('Help: Contact admin@valmatrack.com for support');
                break;
            case '4':
                alert('VALMAtrack v1.0
RFID Attendance System
© 2025');
                break;
        }
    });
}
