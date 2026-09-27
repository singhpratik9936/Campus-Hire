// Initial Mock Jobs Data
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

// State object to track student applications by Job ID
const applicationsMap = {};

// DOM Elements
const jobsGrid = document.getElementById('jobsGrid');
const typeFilter = document.getElementById('typeFilter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTabs = document.querySelectorAll('.tab-btn');

// Modal Elements
const applicationModal = document.getElementById('applicationModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const applyForm = document.getElementById('applyForm');
const modalJobTitle = document.getElementById('modalJobTitle');
const modalCompanyName = document.getElementById('modalCompanyName');
const modalJobId = document.getElementById('modalJobId');

// Render Jobs Function
function renderJobs(filterType = "ALL", searchQuery = "") {
    jobsGrid.innerHTML = "";

    const filtered = jobsData.filter(job => {
        const matchesType = (filterType === "ALL") || (job.type.toLowerCase() === filterType.toLowerCase());
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        jobsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No positions found matching your criteria.</p>`;
        return;
    }

    filtered.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';

        const appliedData = applicationsMap[job.id];

        let actionAreaHTML = `
            <div class="job-footer">
                <span class="salary">${job.salary}</span>
                <button class="btn-apply" onclick="openApplyModal(${job.id})">Apply</button>
            </div>
        `;

        // If Student has already applied, replace Apply Button with Applicant Name and Details
        if (appliedData) {
            actionAreaHTML = `
                <div class="applied-box">
                    <h5><i class="fa-solid fa-circle-check"></i> Applied Successfully</h5>
                    <p><strong>Name:</strong> ${appliedData.name}</p>
                    <p><strong>Email:</strong> ${appliedData.email}</p>
                    <p><strong>GitHub:</strong> <a href="${appliedData.github}" target="_blank" style="color: #60a5fa;">${appliedData.github}</a></p>
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

// Open Application Modal
window.openApplyModal = function(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    modalJobId.value = job.id;
    modalJobTitle.innerText = `Apply for ${job.title}`;
    modalCompanyName.innerText = job.company;
    applicationModal.classList.add('active');
};

// Close Modal Function
function closeModal() {
    applicationModal.classList.remove('active');
    applyForm.reset();
}

// Event Listeners
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Handle Application Form Submission
applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const jobId = modalJobId.value;
    const name = document.getElementById('applicantName').value;
    const email = document.getElementById('applicantEmail').value;
    const github = document.getElementById('applicantGithub').value;

    // Save Application Details
    applicationsMap[jobId] = { name, email, github };

    closeModal();
    renderJobs(getActiveFilter(), searchInput.value);
});

// Helper for Active Filter
function getActiveFilter() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.getAttribute('data-filter') : "ALL";
}

// Search and Filter Events
searchBtn.addEventListener('click', () => {
    renderJobs(typeFilter.value, searchInput.value);
});

typeFilter.addEventListener('change', () => {
    renderJobs(typeFilter.value, searchInput.value);
});

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderJobs(tab.getAttribute('data-filter'), searchInput.value);
    });
});

// Initial Render
renderJobs();
