const loginPage = document.getElementById("loginPage");
const registrationForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const dashboards = {
  donor: document.getElementById("donorDashboard"),
  requester: document.getElementById("requesterDashboard"),
  hospital: document.getElementById("hospitalDashboard")
};

const donorForm = document.getElementById("donorForm");
const requestForm = document.getElementById("requestForm");
const organForm = document.getElementById("organForm");
const organRequestForm = document.getElementById("organRequestForm");
const appointmentForm = document.getElementById("appointmentForm");

const donorList = document.getElementById("donorList");
const requestList = document.getElementById("requestList");
const organList = document.getElementById("organList");
const organRequestList = document.getElementById("organRequestList");
const appointmentList = document.getElementById("appointmentList");
const donorAppointmentList = document.getElementById("donorAppointmentList");
const requesterAppointmentList = document.getElementById("requesterAppointmentList");
const appointmentDonor = document.getElementById("appointmentDonor");
const appointmentRequest = document.getElementById("appointmentRequest");
const searchInput = document.getElementById("searchInput");

const messageModal = document.getElementById("messageModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

let currentUser = JSON.parse(localStorage.getItem("lifelink_current_user")) || null;
let registeredUsers = readData("lifelink_registered_users");
let donors = readData("lifelink_donors");
let requests = readData("lifelink_requests");
let organs = readData("lifelink_organs");
let organRequests = readData("lifelink_organ_requests");
let appointments = readData("lifelink_appointments");

function readData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData() {
  localStorage.setItem("lifelink_registered_users", JSON.stringify(registeredUsers));
  localStorage.setItem("lifelink_donors", JSON.stringify(donors));
  localStorage.setItem("lifelink_requests", JSON.stringify(requests));
  localStorage.setItem("lifelink_organs", JSON.stringify(organs));
  localStorage.setItem("lifelink_organ_requests", JSON.stringify(organRequests));
  localStorage.setItem("lifelink_appointments", JSON.stringify(appointments));
}

function saveCurrentUser() {
  localStorage.setItem("lifelink_current_user", JSON.stringify(currentUser));
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function normalizeText(value) {
  return (value || "").trim().toLowerCase();
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}`;
}

function findRegisteredUser(role, name) {
  return registeredUsers.find((user) => {
    return user.role === role && normalizeText(user.name) === normalizeText(name);
  });
}

function showMessage(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  messageModal.classList.remove("hidden");
}

function showDashboard(role) {
  loginPage.classList.add("hidden");
  logoutBtn.classList.remove("hidden");

  Object.keys(dashboards).forEach((key) => {
    dashboards[key].classList.toggle("hidden", key !== role);
  });

  document.querySelectorAll(".userName").forEach((item) => {
    item.textContent = currentUser ? currentUser.name : "";
  });

  render();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("lifelink_current_user");
  loginPage.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  Object.values(dashboards).forEach((dashboard) => dashboard.classList.add("hidden"));
}

function findBloodMatches(request) {
  return donors.filter((donor) => {
    const sameBlood = donor.bloodGroup === request.bloodGroup;
    const sameCity = donor.city.toLowerCase() === request.city.toLowerCase();
    return sameBlood && sameCity && donor.availability === "Available";
  });
}

function findOrganMatches(request) {
  return organs.filter((organ) => {
    const sameOrgan = organ.organType === request.organType;
    const sameCity = organ.city.toLowerCase() === request.city.toLowerCase();
    return sameOrgan && sameCity;
  });
}

function renderAppointmentOptions() {
  appointmentDonor.innerHTML = '<option value="">Select donor</option>';
  donors.forEach((donor) => {
    appointmentDonor.innerHTML += `<option value="blood:${donor.id}">Blood: ${donor.name} - ${donor.bloodGroup} - ${donor.city}</option>`;
  });
  organs.forEach((organ) => {
    appointmentDonor.innerHTML += `<option value="organ:${organ.id}">Organ: ${organ.name} - ${organ.organType} - ${organ.city}</option>`;
  });

  appointmentRequest.innerHTML = '<option value="">Select request</option>';
  requests.forEach((request) => {
    appointmentRequest.innerHTML += `<option value="blood:${request.id}">Blood: ${request.patient} - ${request.bloodGroup} - ${request.city}</option>`;
  });
  organRequests.forEach((request) => {
    appointmentRequest.innerHTML += `<option value="organ:${request.id}">Organ: ${request.patient} - ${request.organType} - ${request.city}</option>`;
  });
}

function renderHospitalLists() {
  const term = searchInput.value.trim().toLowerCase();

  const filteredDonors = donors.filter((donor) => {
    return donor.city.toLowerCase().includes(term) || donor.bloodGroup.toLowerCase().includes(term);
  });

  donorList.innerHTML = filteredDonors.length ? "" : "<p>No blood donors found.</p>";
  filteredDonors.forEach((donor) => {
    donorList.innerHTML += `
      <article class="item">
        <h3>${donor.name}</h3>
        <p><strong>Blood:</strong> ${donor.bloodGroup}</p>
        <p><strong>City:</strong> ${donor.city}</p>
        <p><strong>Phone:</strong> ${donor.phone}</p>
        <span class="badge ${donor.availability === "Available" ? "" : "warning"}">${donor.availability}</span>
      </article>
    `;
  });

  requestList.innerHTML = requests.length ? "" : "<p>No blood requests yet.</p>";
  requests.forEach((request) => {
    const matches = findBloodMatches(request);
    requestList.innerHTML += `
      <article class="item">
        <h3>${request.patient}</h3>
        <p><strong>Blood Needed:</strong> ${request.bloodGroup}</p>
        <p><strong>Hospital:</strong> ${request.hospital}</p>
        <p><strong>City:</strong> ${request.city}</p>
        <p><strong>Emergency:</strong> ${request.level}</p>
        <span class="badge ${matches.length ? "" : "warning"}">${matches.length} matching donor(s)</span>
      </article>
    `;
  });

  const filteredOrgans = organs.filter((organ) => {
    return organ.city.toLowerCase().includes(term) || organ.organType.toLowerCase().includes(term);
  });

  organList.innerHTML = filteredOrgans.length ? "" : "<p>No organ donors found.</p>";
  filteredOrgans.forEach((organ) => {
    organList.innerHTML += `
      <article class="item">
        <h3>${organ.name}</h3>
        <p><strong>Organ:</strong> ${organ.organType}</p>
        <p><strong>City:</strong> ${organ.city}</p>
        <span class="badge">Organ Donor</span>
      </article>
    `;
  });

  organRequestList.innerHTML = organRequests.length ? "" : "<p>No organ requests yet.</p>";
  organRequests.forEach((request) => {
    const matches = findOrganMatches(request);
    organRequestList.innerHTML += `
      <article class="item">
        <h3>${request.patient}</h3>
        <p><strong>Organ Needed:</strong> ${request.organType}</p>
        <p><strong>Hospital:</strong> ${request.hospital}</p>
        <p><strong>City:</strong> ${request.city}</p>
        <span class="badge ${matches.length ? "" : "warning"}">${matches.length} matching donor(s)</span>
      </article>
    `;
  });
}

function renderAppointments() {
  appointmentList.innerHTML = appointments.length ? "" : "<p>No appointments declared yet.</p>";
  donorAppointmentList.innerHTML = "";
  requesterAppointmentList.innerHTML = "";

  const currentName = normalizeText(currentUser ? currentUser.name : "");
  let donorAppointmentCount = 0;
  let requesterAppointmentCount = 0;

  appointments.forEach((appointment) => {
    const card = `
      <article class="item">
        <h3>${appointment.donorName} with ${appointment.patientName}</h3>
        <p><strong>Type:</strong> ${appointment.requestType}</p>
        <p><strong>Date:</strong> ${appointment.date}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Doctor:</strong> ${appointment.doctor}</p>
        <span class="badge">Appointment Declared</span>
      </article>
    `;
    appointmentList.innerHTML += card;

    const belongsToDonor =
      normalizeText(appointment.donorOwner) === currentName ||
      (!appointment.donorOwner && normalizeText(appointment.donorName) === currentName);
    const belongsToRequester =
      normalizeText(appointment.requestOwner) === currentName ||
      (!appointment.requestOwner && normalizeText(appointment.patientName) === currentName);

    if (belongsToDonor) {
      donorAppointmentList.innerHTML += card;
      donorAppointmentCount += 1;
    }

    if (belongsToRequester) {
      requesterAppointmentList.innerHTML += card;
      requesterAppointmentCount += 1;
    }
  });

  if (!donorAppointmentCount) {
    donorAppointmentList.innerHTML = "<p>No appointment from hospital yet.</p>";
  }

  if (!requesterAppointmentCount) {
    requesterAppointmentList.innerHTML = "<p>No appointment from hospital yet.</p>";
  }
}

function renderStats() {
  document.getElementById("totalDonors").textContent = donors.length;
  document.getElementById("totalRequests").textContent = requests.length + organRequests.length;
  document.getElementById("totalOrgans").textContent = organs.length;
  document.getElementById("totalAppointments").textContent = appointments.length;
}

function render() {
  renderAppointmentOptions();
  renderHospitalLists();
  renderAppointments();
  renderStats();
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = getValue("registerRole");
  const name = getValue("registerName");
  const existingUser = findRegisteredUser(role, name);

  if (existingUser) {
    showMessage("Already Registered", "This name is already registered for the selected role. Please login.");
    return;
  }

  registeredUsers.push({
    id: makeId("user"),
    role,
    name,
    phone: getValue("registerPhone"),
    password: getValue("registerPassword")
  });

  saveData();
  registrationForm.reset();
  showMessage("Registration Successful", "Your account is ready. Please login with the same role, name, and password.");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = getValue("loginRole");
  const name = getValue("loginName");
  const password = getValue("loginPassword");
  const registeredUser = findRegisteredUser(role, name);

  if (!registeredUser || registeredUser.password !== password) {
    showMessage("Login Failed", "Only registered donors, requesters, and hospital doctors can login. Check your role, name, and password.");
    return;
  }

  currentUser = {
    id: registeredUser.id,
    role: registeredUser.role,
    name: registeredUser.name,
    phone: registeredUser.phone
  };
  saveCurrentUser();
  loginForm.reset();
  showDashboard(currentUser.role);
});

logoutBtn.addEventListener("click", logout);

donorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  donors.push({
    id: makeId("donor"),
    owner: currentUser.name,
    name: getValue("donorName"),
    phone: getValue("donorPhone"),
    bloodGroup: getValue("donorBlood"),
    city: getValue("donorCity"),
    availability: getValue("donorAvailable")
  });
  saveData();
  donorForm.reset();
  render();
  showMessage("Donor Submitted", "Your blood donation form is now visible to the hospital doctor.");
});

organForm.addEventListener("submit", (event) => {
  event.preventDefault();
  organs.push({
    id: makeId("organ"),
    owner: currentUser.name,
    name: getValue("organName"),
    city: getValue("organCity"),
    organType: getValue("organType")
  });
  saveData();
  organForm.reset();
  render();
  showMessage("Organ Donor Submitted", "Your organ donation form is now visible to the hospital doctor.");
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  requests.push({
    id: makeId("request"),
    owner: currentUser.name,
    patient: getValue("patientName"),
    bloodGroup: getValue("requestBlood"),
    hospital: getValue("hospitalName"),
    city: getValue("requestCity"),
    level: getValue("emergencyLevel")
  });
  saveData();
  requestForm.reset();
  render();
  showMessage("Blood Request Submitted", "Your request is now visible to the hospital doctor.");
});

organRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  organRequests.push({
    id: makeId("organRequest"),
    owner: currentUser.name,
    patient: getValue("organPatientName"),
    organType: getValue("requiredOrgan"),
    hospital: getValue("organHospitalName"),
    city: getValue("organRequestCity")
  });
  saveData();
  organRequestForm.reset();
  render();
  showMessage("Organ Request Submitted", "Your organ request is now visible to the hospital doctor.");
});

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedDonor = appointmentDonor.value;
  const selectedRequest = appointmentRequest.value;
  const donorType = selectedDonor.split(":")[0];
  const requestKind = selectedRequest.split(":")[0];
  const donorId = selectedDonor.split(":")[1];
  const requestId = selectedRequest.split(":")[1];
  const donor = donorType === "blood"
    ? donors.find((item) => item.id === donorId)
    : organs.find((item) => item.id === donorId);
  const request = requestKind === "blood"
    ? requests.find((item) => item.id === requestId)
    : organRequests.find((item) => item.id === requestId);

  if (donorType !== requestKind) {
    showMessage("Wrong Match", "Please match blood donor with blood request, or organ donor with organ request.");
    return;
  }

  if (!donor || !request) {
    showMessage("Selection Missing", "Please select one donor and one request.");
    return;
  }

  appointments.push({
    id: makeId("appointment"),
    donorId: donor.id,
    requestId: request.id,
    donorOwner: donor.owner,
    requestOwner: request.owner,
    donorName: donor.name,
    patientName: request.patient,
    requestType: requestKind === "blood" ? "Blood Donation" : "Organ Donation",
    date: getValue("appointmentDate"),
    time: getValue("appointmentTime"),
    doctor: getValue("doctorName")
  });

  saveData();
  appointmentForm.reset();
  render();
  showMessage("Appointment Declared", "Appointment is declared and visible in donor/requester dashboards.");
});

document.getElementById("sampleButton").addEventListener("click", () => {
  donors = [
    { id: "d1", owner: "Rahul", name: "Rahul Sharma", phone: "9876543210", bloodGroup: "A+", city: "Pune", availability: "Available" },
    { id: "d2", owner: "Priya", name: "Priya Nair", phone: "9876501234", bloodGroup: "O-", city: "Mumbai", availability: "Available" }
  ];
  requests = [
    { id: "r1", owner: "Meera", patient: "Meera Joshi", bloodGroup: "A+", hospital: "City Care Hospital", city: "Pune", level: "Urgent" }
  ];
  organs = [
    { id: "o1", owner: "Sanjay", name: "Sanjay Patel", city: "Mumbai", organType: "Eyes" }
  ];
  organRequests = [
    { id: "or1", owner: "Neha", patient: "Neha Patil", organType: "Eyes", hospital: "Life Care Hospital", city: "Mumbai" }
  ];
  appointments = [];
  saveData();
  render();
  showMessage("Sample Data Added", "Demo donors and requests are ready for the hospital dashboard.");
});

document.getElementById("clearData").addEventListener("click", () => {
  donors = [];
  requests = [];
  organs = [];
  organRequests = [];
  appointments = [];
  saveData();
  render();
  showMessage("Data Cleared", "All demo records have been removed.");
});

document.getElementById("closeModal").addEventListener("click", () => {
  messageModal.classList.add("hidden");
});

messageModal.addEventListener("click", (event) => {
  if (event.target === messageModal) {
    messageModal.classList.add("hidden");
  }
});

searchInput.addEventListener("input", render);

if (currentUser && findRegisteredUser(currentUser.role, currentUser.name)) {
  showDashboard(currentUser.role);
} else {
  currentUser = null;
  localStorage.removeItem("lifelink_current_user");
}
