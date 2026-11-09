const initialRides = [
  {
    id: 1,
    from: "Model Town",
    to: "Lovely Professional University",
    date: "2026-11-10",
    time: "08:15",
    seats: 2,
    price: 45,
    name: "Aarav Mehta",
    initials: "AM",
    rating: "4.9",
    rides: 28,
    verified: true,
    status: "On schedule",
    period: "morning",
  },
  {
    id: 2,
    from: "Urban Estate Phase 2",
    to: "Jalandhar Bus Stand",
    date: "2026-11-10",
    time: "09:00",
    seats: 1,
    price: 30,
    name: "Riya Sharma",
    initials: "RS",
    rating: "5.0",
    rides: 16,
    verified: true,
    status: "On schedule",
    period: "morning",
  },
  {
    id: 3,
    from: "Adarsh Nagar",
    to: "Phagwara Industrial Area",
    date: "2026-11-10",
    time: "18:10",
    seats: 3,
    price: 55,
    name: "Kabir Singh",
    initials: "KS",
    rating: "4.8",
    rides: 42,
    verified: true,
    status: "Filling fast",
    period: "evening",
  },
  {
    id: 4,
    from: "Model Town",
    to: "Railway Station",
    date: "2026-11-11",
    time: "07:45",
    seats: 2,
    price: 25,
    name: "Ananya Kapoor",
    initials: "AK",
    rating: "4.9",
    rides: 11,
    verified: true,
    status: "On schedule",
    period: "morning",
  },
  {
    id: 5,
    from: "Lajpat Nagar",
    to: "Lovely Professional University",
    date: "2026-11-10",
    time: "17:30",
    seats: 1,
    price: 50,
    name: "Dev Malhotra",
    initials: "DM",
    rating: "4.7",
    rides: 9,
    verified: false,
    status: "On schedule",
    period: "evening",
  },
  {
    id: 6,
    from: "BMC Chowk",
    to: "Phagwara",
    date: "2026-11-11",
    time: "18:45",
    seats: 2,
    price: 60,
    name: "Ishita Verma",
    initials: "IV",
    rating: "5.0",
    rides: 34,
    verified: true,
    status: "On schedule",
    period: "evening",
  },
];
const STORAGE_KEY = "waymate-demo-v1";
let state = loadState();
let openMenuId = null;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
function loadState() {
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        requests: [],
        blocked: [],
        settings: {},
      }
    );
  } catch {
    return { requests: [], blocked: [], settings: {} };
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function formatDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function setView(view) {
  $$(".view").forEach((el) =>
    el.classList.toggle("active", el.id === `view-${view}`),
  );
  $$(".nav-link").forEach((el) =>
    el.classList.toggle("active", el.dataset.view === view),
  );
  $("#breadcrumbCurrent").textContent = {
    feed: "Ride feed",
    publish: "Find a ride",
    requests: "My requests",
    settings: "Settings",
  }[view];
  $("#sidebar").classList.remove("open");
  if (view === "requests") renderRequests();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderRides() {
  const query = $("#rideSearch").value.trim().toLowerCase(),
    filter = $("#rideFilter").value;
  const blocked = new Set(state.blocked);
  const rides = initialRides.filter(
    (r) =>
      !blocked.has(r.name) &&
      (!query || `${r.from} ${r.to} ${r.name}`.toLowerCase().includes(query)) &&
      (filter === "all" || r.period === filter),
  );
  $("#activeRideCount").textContent = String(rides.length).padStart(2, "0");
  $("#rideList").innerHTML = rides
    .map((r) => {
      const requested = state.requests.some((x) => x.rideId === r.id);
      return `<article class="ride-card">
      <div><div class="ride-topline"><span class="ride-time">${formatDate(r.date)} · ${r.time}</span><span class="status-pill">${r.status}</span>${r.verified ? '<span class="verified-pill">✓ Verified</span>' : ""}</div>
      <div class="route-line"><div class="route-point"><span class="route-dot"></span><div><small>PICKUP</small><strong>${escapeHTML(r.from)}</strong></div></div><div class="route-connector"></div><div class="route-point"><span class="route-dot end"></span><div><small>DROP-OFF</small><strong>${escapeHTML(r.to)}</strong></div></div></div>
      <div class="ride-bottom"><div class="driver"><div class="avatar">${escapeHTML(r.initials)}</div><div class="driver-info"><strong>${escapeHTML(r.name)}</strong><span>${r.rides} completed rides</span></div></div><span class="rating"><b>★</b> ${r.rating}</span><span class="seats-pill">${r.seats} seat${r.seats === 1 ? "" : "s"} left</span></div></div>
      <div class="ride-actions"><div class="ride-price">₹${r.price} <small>/ seat</small></div><div style="display:flex;align-items:center;gap:7px"><button class="primary-button join-button" data-request="${r.id}" ${requested ? "disabled" : ""}>${requested ? "Requested" : "Request to join"}</button><div class="more-wrap"><button class="icon-button more-button" data-menu="${r.id}" aria-label="More options">···</button>${openMenuId === r.id ? `<div class="menu-pop"><button data-report="${r.id}">Report member</button><button class="danger" data-block="${r.id}">Block member</button></div>` : ""}</div></div></div>
    </article>`;
    })
    .join("");
  $("#emptyState").classList.toggle("hidden", rides.length !== 0);
}
function renderRequests() {
  const list = $("#requestList");
  $("#requestCount").textContent = state.requests.length;
  if (!state.requests.length) {
    list.innerHTML =
      '<div class="no-requests">You haven’t sent any ride requests yet.<br>Explore the ride feed to find a match.</div>';
    return;
  }
  list.innerHTML = state.requests
    .map((req) => {
      const r = initialRides.find((x) => x.id === req.rideId);
      return `<div class="request-item"><div class="request-route"><strong>${r ? escapeHTML(r.from) + " → " + escapeHTML(r.to) : "Ride unavailable"}</strong><span>${r ? formatDate(r.date) + " · " + r.time + " · " + escapeHTML(r.name) : "This ride is no longer listed"}</span></div><span class="request-status">Pending</span></div>`;
    })
    .join("");
}
function showModal(title, text, confirmLabel = "View my requests") {
  $("#modalTitle").textContent = title;
  $("#modalText").textContent = text;
  $("#modalConfirm").textContent = confirmLabel;
  $("#modalBackdrop").classList.remove("hidden");
}
function closeModal() {
  $("#modalBackdrop").classList.add("hidden");
}
$("#rideList").addEventListener("click", (e) => {
  const request = e.target.closest("[data-request]");
  if (request) {
    const id = Number(request.dataset.request);
    if (state.requests.some((x) => x.rideId === id)) return;
    state.requests.push({ rideId: id, createdAt: Date.now() });
    saveState();
    renderRides();
    renderRequests();
    const ride = initialRides.find((x) => x.id === id);
    showModal(
      "Request sent",
      `Your request to join ${ride.name}'s ride from ${ride.from} to ${ride.to} has been sent. You can track it under My requests.`,
    );
    return;
  }
  const menu = e.target.closest("[data-menu]");
  if (menu) {
    openMenuId =
      openMenuId === Number(menu.dataset.menu)
        ? null
        : Number(menu.dataset.menu);
    renderRides();
    return;
  }
  const report = e.target.closest("[data-report]");
  if (report) {
    const r = initialRides.find((x) => x.id === Number(report.dataset.report));
    openMenuId = null;
    renderRides();
    showModal(
      "Report this member",
      `A report for ${r.name} has been prepared in this demo. In a live app, this would be securely sent to the moderation team.`,
      "Close",
    );
    return;
  }
  const block = e.target.closest("[data-block]");
  if (block) {
    const r = initialRides.find((x) => x.id === Number(block.dataset.block));
    if (!state.blocked.includes(r.name)) state.blocked.push(r.name);
    saveState();
    openMenuId = null;
    renderRides();
    showToast(`${r.name} has been hidden from your ride feed.`);
  }
});
$("#rideSearch").addEventListener("input", renderRides);
$("#rideFilter").addEventListener("change", renderRides);
$("#clearFilters").addEventListener("click", () => {
  $("#rideSearch").value = "";
  $("#rideFilter").value = "all";
  renderRides();
});
$$(".nav-link").forEach((b) =>
  b.addEventListener("click", () => setView(b.dataset.view)),
);
$$("[data-go]").forEach((b) =>
  b.addEventListener("click", () => setView(b.dataset.go)),
);
$("#menuToggle").addEventListener("click", () =>
  $("#sidebar").classList.toggle("open"),
);
$("#routeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  const message = `Looking to ${data.role === "join" ? "join" : "offer"} a ride from ${data.from} to ${data.to} on ${data.date} at ${data.time}.`;
  $("#formMessage").textContent =
    "✓ Your route details are ready. Matching is a demo here; connect a backend to search live rides.";
  $("#formMessage").classList.remove("hidden");
  showToast("Route details saved for this demo.");
});
$("#travelDate").min = new Date().toISOString().slice(0, 10);
["profileVisibility", "showRating", "shareRoute", "notifications"].forEach(
  (id) => {
    const el = $("#" + id);
    const saved = state.settings[id];
    if (saved !== undefined) el.checked = saved;
    el.addEventListener("change", () => {
      state.settings[id] = el.checked;
      saveState();
      $("#settingsSaved").textContent = "✓ Preference updated.";
    });
  },
);
$("#resetDemo").addEventListener("click", () => {
  if (confirm("Reset all demo requests, blocks and privacy preferences?")) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    renderRides();
    renderRequests();
    ["profileVisibility", "showRating", "shareRoute", "notifications"].forEach(
      (id) => ($("#" + id).checked = true),
    );
    $("#settingsSaved").textContent = "✓ Demo data reset.";
    showToast("Demo data has been reset.");
  }
});
$("#modalClose").addEventListener("click", closeModal);
$("#modalCancel").addEventListener("click", closeModal);
$("#modalConfirm").addEventListener("click", () => {
  closeModal();
  setView("requests");
});
$("#modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") closeModal();
});
document.addEventListener("click", (e) => {
  if (openMenuId !== null && !e.target.closest(".more-wrap")) {
    openMenuId = null;
    renderRides();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    $("#sidebar").classList.remove("open");
  }
});
renderRides();
renderRequests();
