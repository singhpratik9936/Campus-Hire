// Auth Modals & Form Elements
const loginModalHTML = `
    <div class="modal-overlay" id="authModal">
        <div class="modal-box">
            <button class="close-modal" id="closeAuthBtn">&times;</button>
            <h3 id="authTitle">Login</h3>
            <p id="authSub" class="modal-sub">Enter your details to continue</p>
            
            <form id="authForm">
                <div class="form-group" id="nameGroup" style="display:none;">
                    <label>Full Name *</label>
                    <input type="text" id="authName" placeholder="e.g. Pratik Singh">
                </div>
                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" id="authEmail" placeholder="e.g. user@gmail.com" required>
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

document.body.insertAdjacentHTML('beforeend', loginModalHTML);

// Current Logged-in User State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Auth Elements
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const nameGroup = document.getElementById('nameGroup');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');

let isRegisterMode = false;

// Update UI based on Auth State
function updateAuthUI() {
    const navButtons = document.querySelector('.nav-buttons');
    if (currentUser) {
        navButtons.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:#60a5fa; font-size:13px; font-weight:600;">👤 ${currentUser.name || currentUser.email}</span>
                <button class="btn-login" id="logoutBtn" style="border-color:#ef4444; color:#ef4444;">Logout</button>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
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
    if (registerMode) authName.setAttribute('required', 'true');
    else authName.removeAttribute('required');
    authModal.classList.add('active');
}

function closeAuthModal() {
    authModal.classList.remove('active');
    authForm.reset();
}

document.getElementById('closeAuthBtn').addEventListener('click', closeAuthModal);
document.getElementById('cancelAuthBtn').addEventListener('click', closeAuthModal);

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    if (isRegisterMode) {
        const name = authName.value;
        const existing = users.find(u => u.email === email);
        if (existing) {
            alert("Email already registered!");
            return;
        }
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        currentUser = newUser;
        alert("Registration Successful!");
    } else {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            alert("Invalid Email or Password!");
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        alert("Logged in Successfully!");
    }

    closeAuthModal();
    updateAuthUI();
});

// Initialize Nav Bar Auth
updateAuthUI();
