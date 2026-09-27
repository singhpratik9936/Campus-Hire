// ==========================================
// 1. MOCK JOBS DATA & STATE
// ==========================================
const jobsData = [
    {
        id: 1,
        title: "System Engineer",
        company: "TCS",
        location: "Bangalore",
        type: "Full Time",
        posted: "2 days ago",
        salary: "₹6.5 LPA",
        rating: "4.2",
        tags: ["Java", "SQL", "Testing"]
    },
    {
        id: 2,
        title: "SDE Intern",
        company: "Infosys",
        location: "Hyderabad",
        type: "Internship",
        posted: "1 day ago",
        salary: "₹25K/month",
        rating: "4.0",
        tags: ["Python", "Django", "REST API"]
    },
    {
        id: 3,
        title: "Trainee Engineer",
        company: "Wipro",
        location: "Pune",
        type: "Full Time",
        posted: "3 days ago",
        salary: "₹5.5 LPA",
        rating: "4.1",
        tags: ["C++", "Linux", "DevOps"]
    },
    {
        id: 4,
        title: "App Dev Associate",
        company: "Accenture",
        location: "Gurgaon",
        type: "Full Time",
        posted: "Today",
        salary: "₹7.0 LPA",
        rating: "4.0",
        tags: ["React", "Node.js", "MongoDB"]
    },
    {
        id: 5,
        title: "Graduate Trainee",
        company: "HCL",
        location: "Noida",
        type: "Full Time",
        posted: "4 days ago",
        salary: "₹5.0 LPA",
        rating: "3.9",
        tags: ["Java", "Spring Boot", "SQL"]
    },
    {
        id: 6,
        title: "Cloud Engineer Intern",
        company: "TechMahindra",
        location: "Chennai",
        type: "Internship",
        posted: "Today",
        salary: "₹20K/month",
        rating: "4.3",
        tags: ["AWS", "Python", "Docker"]
    }
];

// Track Applications state (Job ID -> Applicant Data)
const applicationsMap = {};

// Current Auth User State
let currentUser = JSON.parse(localStorage.getItem('campusHireUser')) || null;

// ==========================================
// 2. INJECT LOGIN/REGISTER MODAL INTO HTML
// ==========================================
const authModalHTML = `
    <div class="modal-overlay" id="authModal">
        <div class="modal-box">
            <button class="close-modal" id="closeAuthBtn">&times;</button>
            <h3 id="authTitle" style="margin-bottom:4px;">Login to CampusHire</h3>
            <p id="authSub" class="modal-sub">Enter your details to access your profile</p>
            
            <form id="authForm">
                <div class="form-group" id="nameGroup" style="display:none;">
                    <label>Full Name *</label>
                    <input type="text" id="authName" placeholder="e.g. Pratik Singh">
                </div>
                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" id="authEmail" placeholder="e.g. pratik@gmail.com" required>
                </div>
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" id="authPassword" placeholder="••••••••" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" id="cancelAuthBtn">Cancel</button>
                    <button type="submit" class="btn-submit" id="authSubmitBtn">Login</button>
                </div>
            </form>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', authModalHTML);

// ==========================================
// 3. DOM ELEMENTS
// ==========================================
const jobsGrid = document.getElementById('jobsGrid');
const typeFilter = document.getElementById('typeFilter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTabs = document.querySelectorAll('.tab-btn');

// Apply Job Modal Elements
const applicationModal = document.getElementById('applicationModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const applyForm = document.getElementById('applyForm');
const modalJobTitle = document.getElementById('modalJobTitle');
const modalCompanyName = document.getElementById('modalCompanyName');
const modalJobId = document.getElementById('modalJobId');

// Auth Modal Elements
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const cancelAuthBtn = document.getElementById('cancelAuthBtn');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const nameGroup = document.getElementById('nameGroup');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');

let isRegisterMode = false;

// ==========================================
// 4. AUTHENTICATION LOGIC (LOGIN / REGISTER)
// ==========================================
function updateAuthUI() {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;

    if (currentUser) {
        navButtons.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <span style="color:#60a5fa; font-size:13px; font-weight:600; background:#1e293b; padding:6px 12px; border-radius:20px; border:1px solid #334155;">
                    👤 ${currentUser.name || currentUser.email}
                </span>
                <button class="btn-login" id="logoutBtn" style="border-color:#ef4444; color:#ef4444;">Logout</button>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('campusHireUser');
            currentUser = null;
            updateAuthUI();
            alert("Logged out successfully!");
        });
    } else {
        navButtons.innerHTML = `
            <button class="btn-login" id="loginBtn">Login</button>
            <button class="btn-register" id="registerBtn">Register</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', () => openAuthModal(false));
        document.getElementById('registerBtn').addEventListener('click', () => openAuthModal(true));
    }
}

function openAuthModal(registerMode = false) {
    isRegisterMode = registerMode;
    authTitle.innerText = registerMode ? "Register Account" : "Login to CampusHire";
    authSubmitBtn.innerText = registerMode ? "Register" : "Login";
    nameGroup.style.display = registerMode ? "block" : "none";
    
    if (registerMode) {
        authName.setAttribute('required', 'true');
    } else {
        authName.removeAttribute('required');
    }
    authModal.classList.add('active');
}

function closeAuthModal() {
    authModal.classList.remove('active');
    authForm.reset();
}

if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
if (cancelAuthBtn) cancelAuthBtn.addEventListener('click', closeAuthModal);

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();
        const users = JSON.parse(localStorage.getItem('campusHireUsers')) || [];

        if (isRegisterMode) {
            const name = authName.value.trim();
            const existing = users.find(u => u.email === email);
            if (existing) {
                alert("This email is already registered!");
                return;
            }
            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('campusHireUsers', JSON.stringify(users));
            localStorage.setItem('campusHireUser', JSON.stringify(newUser));
            currentUser = newUser;
            alert("Registration Successful!");
        } else {
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                alert("Invalid Email or Password!");
                return;
            }
            localStorage.setItem('campusHireUser', JSON.stringify(user));
            currentUser = user;
            alert("Logged in Successfully!");
        }

        closeAuthModal();
        updateAuthUI();
    });
}

// ==========================================
// 5. RENDER JOBS & SEARCH FILTERING
// ==========================================
function renderJobs(filterType = "ALL", searchQuery = "") {
    if (!jobsGrid) return;
    jobsGrid.innerHTML = "";

    const query = searchQuery.trim().toLowerCase();

    const filtered = jobsData.filter(job => {
        const matchesType = (filterType === "ALL") || (job.type.toLowerCase() === filterType.toLowerCase());
        const matchesSearch = query === "" ||
                              job.title.toLowerCase().includes(query) || 
                              job.company.toLowerCase().includes(query) ||
                              job.location.toLowerCase().includes(query) ||
                              job.tags.some(tag => tag.toLowerCase().includes(query));
        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        jobsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px; font-size: 16px;">No positions found matching "${searchQuery}".</p>`;
        return;
    }

    filtered.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';

        // Check if student already applied for this job
        const appliedData = applicationsMap[job.id];

        let actionAreaHTML = "";
        if (appliedData) {
            // Display student details permanently once applied
            actionAreaHTML = `
                <div class="applied-box">
                    <h5><i class="fa-solid fa-circle-check"></i> Applied Successfully</h5>
                    <p><strong>Name:</strong> ${appliedData.name}</p>
                    <p><strong>Email:</strong> ${appliedData.email}</p>
                    <p><strong>GitHub:</strong> <a href="${appliedData.github}" target="_blank" style="color: #60a5fa; text-decoration:underline;">${appliedData.github}</a></p>
                </div>
            `;
        } else {
            // Display normal apply button
            actionAreaHTML = `
                <div class="job-footer">
                    <span class="salary">${job.salary}</span>
                    <button class="btn-apply" onclick="openApplyModal(${job.id})">Apply</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div>
                <div class="job-header">
                    <div class="company-badge">
                        <div class="company-icon"><i class="fa-solid fa-building"></i></div>
                        <div>
                            <span class="company-name">${job.company}</span>
                            <span style="font-size: 11px; color: #f59e0b; margin-left: 6px;">★ ${job.rating}</span>
                        </div>
                    </div>
                    <span class="job-type-tag">${job.type}</span>
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-details">
                    <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                    <span><i class="fa-regular fa-clock"></i> ${job.posted}</span>
                </div>
                <div class="job-tags">
                    ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
            ${actionAreaHTML}
        `;

        jobsGrid.appendChild(card);
    });
}

// Perform Search Action and Smooth Scroll to Jobs Section
function performSearch() {
    const selectedType = typeFilter ? typeFilter.value : "ALL";
    const query = searchInput ? searchInput.value : "";
    
    renderJobs(selectedType, query);

    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Global Company Filter function for "Hiring Now" tags
window.filterByCompany = function(companyName) {
    if (searchInput) {
        searchInput.value = companyName;
    }
    performSearch();
};

// ==========================================
// 6. APPLY JOB MODAL HANDLERS
// ==========================================
window.openApplyModal = function(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    modalJobId.value = job.id;
    modalJobTitle.innerText = `Apply for ${job.title}`;
    modalCompanyName.innerText = job.company;

    // Auto-fill applicant details if user is logged in
    if (currentUser) {
        document.getElementById('applicantName').value = currentUser.name || '';
        document.getElementById('applicantEmail').value = currentUser.email || '';
    }

    applicationModal.classList.add('active');
};

function closeApplyModal() {
    applicationModal.classList.remove('active');
    applyForm.reset();
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeApplyModal);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeApplyModal);

if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const jobId = modalJobId.value;
        const name = document.getElementById('applicantName').value.trim();
        const email = document.getElementById('applicantEmail').value.trim();
        const github = document.getElementById('applicantGithub').value.trim();

        // Store student application against the specific Job ID
        applicationsMap[jobId] = { name, email, github };

        closeApplyModal();
        renderJobs(getActiveFilter(), searchInput ? searchInput.value : "");
    });
}

// Helper for Filter Tabs
function getActiveFilter() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.getAttribute('data-filter') : "ALL";
}

// ==========================================
// 7. EVENT LISTENERS & INITIALIZATION
// ==========================================

// Click on Search Button
if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

// Press Enter inside Search Input Box
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    // Instant filter on typing
    searchInput.addEventListener('input', () => {
        const selectedType = typeFilter ? typeFilter.value : "ALL";
        renderJobs(selectedType, searchInput.value);
    });
}

// Dropdown Type Filter Change
if (typeFilter) {
    typeFilter.addEventListener('change', () => {
        performSearch();
    });
}

// Tab Category Filters (All / Full Time / Internships)
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderJobs(tab.getAttribute('data-filter'), searchInput ? searchInput.value : "");
    });
});

// App Startup
updateAuthUI();
renderJobs();
