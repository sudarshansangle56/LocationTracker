const socket = io();

if (navigator.geolocation) {
    console.log('Geolocation supported');
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error('Geolocation error:', error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    });
} else {
    console.error('Geolocation not supported');
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received Latitude: ${latitude}, Longitude: ${longitude}`);
    map.setView([latitude, longitude], 10); // 10 is the zoom level
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
