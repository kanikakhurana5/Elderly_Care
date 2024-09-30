let map, userLocation;
let caregivers = [];
let caregiverMarkers = [];
let markerCluster;
let selectedCaregiver = null;

function initMap() {
    map = L.map('map').setView([19.0760, 72.8777], 12); // Centered on Mumbai

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    markerCluster = L.markerClusterGroup(); // Initialize marker cluster
}

document.getElementById('locateMe').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    html: '📍', // User pin as emoji
                    className: 'user-pin',
                    iconSize: [32, 32]
                })
            }).bindPopup("You are here").addTo(map);
            map.setView(userLocation, 12);
            fetchCaregivers();
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchCaregivers() {
    fetch('/api/caregivers') // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            caregivers = data;
            caregivers.sort((a, b) => b.rating - a.rating); // Sort by rating descending
            displayCaregivers();
            plotCaregiversOnMap(); // Plot on initial load
        })
        .catch(error => console.error('Error fetching caregiver data:', error));
}

function displayCaregivers() {
    const caregiverList = document.getElementById('caregiverList');
    caregiverList.innerHTML = '';

    caregivers.forEach(caregiver => {
        const listItem = document.createElement('div');
        listItem.classList.add('caregiver-item');
        listItem.innerHTML = `
            <h4>${caregiver.name}</h4>
            <p>Specialty: ${caregiver.specialty}</p>
            <p>Experience: ${caregiver.experience} years</p>
            <p>Rating: ${caregiver.rating}/5</p>
            <button class="book-btn" data-id="${caregiver.caregiver_id}">Book</button>
        `;
        caregiverList.appendChild(listItem);
    });

    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', showBookingModal);
    });
}

function plotCaregiversOnMap() {
    markerCluster.clearLayers(); // Clear previous markers

    caregivers.forEach(caregiver => {
        const marker = L.marker([caregiver.latitude, caregiver.longitude], {
            icon: L.divIcon({
                html: '🧑‍⚕️', // Caregiver emoji
                className: 'emoji-pin',
                iconSize: [30, 30]
            })
        });

        marker.bindPopup(`<h4>${caregiver.name}</h4><p>${caregiver.specialty}</p><p>Rating: ${caregiver.rating}/5</p>`);
        markerCluster.addLayer(marker); // Add marker to the cluster
    });

    map.addLayer(markerCluster); // Add marker cluster to the map
}

document.getElementById('applyFilters').addEventListener('click', filterCaregivers);

function filterCaregivers() {
    const distanceFilter = document.getElementById('distance').value;
    const experienceFilter = document.getElementById('experience').value;
    const specialtyFilter = document.getElementById('specialty').value;
    const ratingFilter = document.getElementById('rating').value;

    const filteredCaregivers = caregivers.filter(caregiver => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, caregiver.latitude, caregiver.longitude);
        return (
            (distanceFilter === 'any' || distance <= distanceFilter) &&
            (experienceFilter === 'any' || caregiver.experience >= parseInt(experienceFilter)) &&
            (specialtyFilter === 'any' || caregiver.specialty === specialtyFilter) &&
            (ratingFilter === 'any' || caregiver.rating >= parseFloat(ratingFilter))
        );
    });

    displayFilteredCaregivers(filteredCaregivers);
}

function displayFilteredCaregivers(filteredCaregivers) {
    const caregiverList = document.getElementById('caregiverList');
    caregiverList.innerHTML = '';

    filteredCaregivers.forEach(caregiver => {
        const listItem = document.createElement('div');
        listItem.classList.add('caregiver-item');
        listItem.innerHTML = `
            <h4>${caregiver.name}</h4>
            <p>Specialty: ${caregiver.specialty}</p>
            <p>Experience: ${caregiver.experience} years</p>
            <p>Rating: ${caregiver.rating}/5</p>
            <button class="book-btn" data-id="${caregiver.caregiver_id}">Book</button>
        `;
        caregiverList.appendChild(listItem);
    });

    document.querySelectorAll('.book-btn').forEach(button => {
        button.addEventListener('click', showBookingModal);
    });

    plotFilteredCaregiversOnMap(filteredCaregivers);
}

function plotFilteredCaregiversOnMap(filteredCaregivers) {
    markerCluster.clearLayers(); // Clear previous markers

    filteredCaregivers.forEach(caregiver => {
        const marker = L.marker([caregiver.latitude, caregiver.longitude], {
            icon: L.divIcon({
                html: '🧑‍⚕️', // Caregiver emoji
                className: 'emoji-pin',
                iconSize: [30, 30]
            })
        });

        marker.bindPopup(`<h4>${caregiver.name}</h4><p>${caregiver.specialty}</p><p>Rating: ${caregiver.rating}/5</p>`);
        markerCluster.addLayer(marker); // Add filtered marker to the cluster
    });

    map.addLayer(markerCluster); // Add updated marker cluster to the map
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Show booking modal
function showBookingModal(event) {
    const caregiverId = event.target.getAttribute('data-id');
    selectedCaregiver = caregivers.find(caregiver => caregiver.caregiver_id == caregiverId);

    const bookingDetails = document.getElementById('bookingDetails');
    bookingDetails.innerHTML = `
        <p>Name: ${selectedCaregiver.name}</p>
        <p>Specialty: ${selectedCaregiver.specialty}</p>
        <p>Experience: ${selectedCaregiver.experience} years</p>
        <p>Rating: ${selectedCaregiver.rating}/5</p>
        <p>Location: (${selectedCaregiver.latitude}, ${selectedCaregiver.longitude})</p>
    `;

    document.getElementById('bookingModal').style.display = "block"; // Show modal
}

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('bookingModal').style.display = "none";
});

// Confirm booking
document.getElementById('confirmBooking').addEventListener('click', () => {
    const randomDate = getRandomDate();
    alert(`Booking confirmed for ${selectedCaregiver.name} on ${randomDate}`);
    document.getElementById('bookingModal').style.display = "none"; // Close modal
});

// Get a random date and time for booking
function getRandomDate() {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 30); // Booking within the next 30 days
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toLocaleString(); // Format the date
}

// Initialize the map when the page loads
window.onload = initMap;
