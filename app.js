// Sample Job Listings Data
const jobData = [
  {
    id: 1,
    title: "System Engineer",
    company: "TCS",
    location: "Bangalore",
    type: "Internship",
    category: "Software",
    posted: "2 days ago",
    stipend: "₹30,000 / month",
    skills: ["Java", "SQL", "Git"]
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Infosys",
    location: "Hyderabad",
    type: "Full-Time",
    category: "Software",
    posted: "1 day ago",
    stipend: "6.5 LPA",
    skills: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 3,
    title: "Cloud Associate",
    company: "Wipro",
    location: "Pune",
    type: "Full-Time",
    category: "Cloud",
    posted: "3 days ago",
    stipend: "5.0 LPA",
    skills: ["AWS", "Linux", "Python"]
  },
  {
    id: 4,
    title: "Data Analyst Intern",
    company: "Accenture",
    location: "Gurugram",
    type: "Internship",
    category: "Data",
    posted: "Just now",
    stipend: "₹25,000 / month",
    skills: ["Python", "SQL", "PowerBI"]
  },
  {
    id: 5,
    title: "Backend Engineer",
    company: "Cognizant",
    location: "Chennai",
    type: "Full-Time",
    category: "Software",
    posted: "4 days ago",
    stipend: "5.5 LPA",
    skills: ["Java", "Spring Boot", "MySQL"]
  }
];

let selectedCategory = "ALL";
let currentApplyTarget = null;

// DOM Elements
const jobsGrid = document.getElementById("jobs-grid");
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const searchBtn = document.getElementById("search-btn");
const categoryPills = document.querySelectorAll(".pill-btn");

const applyModal = document.getElementById("apply-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const applyForm = document.getElementById("apply-form");
const modalCompany = document.getElementById("modal-company");

// Render Job Cards
function renderJobs() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedType = typeFilter.value;

  const filteredJobs = jobData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(query) || 
                          job.company.toLowerCase().includes(query) || 
                          job.skills.some(s => s.toLowerCase().includes(query));
    
    const matchesType = selectedType === "ALL" || job.type === selectedType;
    const matchesCategory = selectedCategory === "ALL" || job.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  if (filteredJobs.length === 0) {
    jobsGrid.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800">
        <i class="fa-solid fa-magnifying-glass text-3xl mb-3 text-slate-600"></i>
        <p class="font-medium">No job postings found matching your criteria.</p>
      </div>
    `;
    return;
  }

  jobsGrid.innerHTML = filteredJobs.map(job => `
    <div class="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold px-3 py-1 rounded-full border ${
            job.type === 'Internship' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }">
            ${job.type}
          </span>
          <span class="text-[11px] font-medium text-slate-500">${job.posted}</span>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition">${job.title}</h3>
        
        <div class="mt-3 space-y-2 text-xs text-slate-400">
          <p class="flex items-center gap-2">
            <i class="fa-solid fa-building text-slate-500 w-4"></i> ${job.company}
          </p>
          <p class="flex items-center gap-2">
            <i class="fa-solid fa-location-dot text-slate-500 w-4"></i> ${job.location}
          </p>
          <p class="flex items-center gap-2">
            <i class="fa-solid fa-wallet text-slate-500 w-4"></i> ${job.stipend}
          </p>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-4">
          ${job.skills.map(s => `<span class="bg-slate-800 text-slate-400 text-[10px] font-semibold px-2.5 py-1 rounded-lg">${s}</span>`).join('')}
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button onclick="openModal('${job.company}', '${job.title}')" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20">
          Apply Now
        </button>
      </div>
    </div>
  `).join('');
}

// Category Pills Event
categoryPills.forEach(pill => {
  pill.addEventListener("click", () => {
    categoryPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    selectedCategory = pill.dataset.cat;
    renderJobs();
  });
});

// Search Actions
searchBtn.addEventListener("click", renderJobs);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") renderJobs();
});
typeFilter.addEventListener("change", renderJobs);

// Modal Controllers
function openModal(company, title) {
  modalCompany.textContent = `${title} at ${company}`;
  applyModal.classList.remove("opacity-0", "pointer-events-none");
  applyModal.querySelector("div").classList.remove("scale-95");
}

closeModalBtn.addEventListener("click", () => {
  applyModal.classList.add("opacity-0", "pointer-events-none");
  applyModal.querySelector("div").classList.add("scale-95");
});

// Form Submit Handler
applyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyModal.classList.add("opacity-0", "pointer-events-none");
  showToast("Application submitted successfully!", "fa-circle-check");
  applyForm.reset();
});

// Toast System
function showToast(msg, icon) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  const toastIcon = document.getElementById("toast-icon");

  toastMsg.textContent = msg;
  toastIcon.className = `fa-solid ${icon}`;

  toast.classList.remove("opacity-0", "pointer-events-none", "translate-y-[-10px]");
  setTimeout(() => {
    toast.classList.add("opacity-0", "pointer-events-none", "translate-y-[-10px]");
  }, 3000);
}

// Initial Load
document.addEventListener("DOMContentLoaded", renderJobs);
