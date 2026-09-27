// ==========================================
// 1. Firebase Modules Import (CDN Modular SDK)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 2. Updated Firebase Configuration
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD-tG-ZiXoUt-DYxI1zvCCcgAfeKHoBi2w",
  authDomain: "campus-hire-c5947.firebaseapp.com",
  projectId: "campus-hire-c5947",
  storageBucket: "campus-hire-c5947.firebasestorage.app",
  messagingSenderId: "300835522015",
  appId: "1:300835522015:web:8348706c8b50bff61bb06a",
  measurementId: "G-YT7SK932NL"
};

// ==========================================
// 3. Initialize Firebase Services
// ==========================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentAuthMode = 'login'; // Default mode

// ==========================================
// 4. Modal Window Controls (Login / Register)
// ==========================================
window.openModal = function(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const nameField = document.getElementById('nameField');

    if (modal) modal.style.display = 'flex';
    if (modalTitle) {
        modalTitle.innerText = mode === 'login' ? 'Login to Your Account' : 'Create Your Account';
    }
    if (nameField) {
        nameField.style.display = mode === 'register' ? 'block' : 'none';
    }
};

window.closeModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
};

// ==========================================
// 5. User Authentication & Registration (Collection: "Users")
// ==========================================
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            if (currentAuthMode === 'register') {
                const fullName = document.getElementById('fullName').value.trim();
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                // Firestore Collection "Users" me Record Save Karein
                await addDoc(collection(db, "Users"), {
                    uid: userCredential.user.uid,
                    name: fullName,
                    email: email,
                    role: "student",
                    createdAt: serverTimestamp()
                });

                alert("Account created successfully! Welcome to CampusHire.");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Logged in successfully!");
            }
            window.closeModal();
        } catch (error) {
            console.error("Auth Error:", error);
            alert("Error: " + error.message);
        }
    });
}

// Track User Login State
onAuthStateChanged(auth, (user) => {
    const authBtns = document.querySelector('.auth-btns');
    if (user) {
        console.log("User logged in:", user.email);
        if (authBtns) {
            authBtns.innerHTML = `
                <span style="color: #0066ff; font-weight: 600; margin-right: 10px;">${user.email}</span>
                <button onclick="logoutUser()" style="background: #ff4d4d; color: white; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer;">Logout</button>
            `;
        }
    } else {
        if (authBtns) {
            authBtns.innerHTML = `
                <button id="loginBtn" onclick="openModal('login')">Login</button>
                <button id="registerBtn" onclick="openModal('register')">Register</button>
            `;
        }
    }
});

window.logoutUser = function() {
    signOut(auth).then(() => {
        alert("Logged out successfully.");
        window.location.reload();
    });
};

// ==========================================
// 6. Fetch & Render Jobs/Internships (Collection: "Jobs")
// ==========================================
async function fetchAndRenderJobs() {
    const jobList = document.getElementById('jobList');
    if (!jobList) return;

    jobList.innerHTML = "<p>Loading available opportunities...</p>";

    try {
        // Firestore Collection "Jobs" se data fetch ho raha hai
        const querySnapshot = await getDocs(collection(db, "Jobs"));
        jobList.innerHTML = ""; // Clear loading text

        if (querySnapshot.empty) {
            jobList.innerHTML = "<p>No active job/internship postings found.</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const cardHtml = `
                <div class="job-card">
                    <h3>${data.role || 'Software Developer Intern'}</h3>
                    <p><strong>Company:</strong> ${data.company || 'Tech Corp'}</p>
                    <p><strong>Location:</strong> ${data.location || 'Remote'}</p>
                    <p><strong>Type:</strong> ${data.type || 'Full Time'}</p>
                    <button onclick="applyForJob('${docSnap.id}', '${data.company || 'Company'}')">Apply Now</button>
                </div>
            `;
            jobList.innerHTML += cardHtml;
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobList.innerHTML = "<p style='color:red;'>Failed to load jobs. Please check database connection or security rules.</p>";
    }
}

// ==========================================
// 7. Apply Job Functionality (Collection: "Applications")
// ==========================================
window.applyForJob = async function(jobId, companyName) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert("Please login first to apply for jobs!");
        window.openModal('login');
        return;
    }

    try {
        // Firestore Collection "Applications" me Record Save Karein
        await addDoc(collection(db, "Applications"), {
            jobId: jobId,
            applicantUid: currentUser.uid,
            applicantEmail: currentUser.email,
            appliedAt: serverTimestamp(),
            status: "Applied"
        });
        alert(`Successfully applied for the position at ${companyName}!`);
    } catch (error) {
        console.error("Error applying:", error);
        alert("Failed to apply: " + error.message);
    }
};

// Page Load hone par jobs render karein
document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderJobs();
});