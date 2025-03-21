// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",
    authDomain: "hk-invoice-new.firebaseapp.com",
    projectId: "hk-invoice-new",
    storageBucket: "hk-invoice-new.firebasestorage.app",
    messagingSenderId: "433334964621",
    appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to load buyers into the dropdown
function loadBuyers() {
    const buyerSelect = document.getElementById("buyerSelect");
    buyerSelect.innerHTML = '<option value="">Loading...</option>'; // Show loading text

    db.collection("buyers").get().then((querySnapshot) => {
        buyerSelect.innerHTML = '<option value="">Select a Buyer</option>'; // Reset options
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const option = document.createElement("option");
            option.value = doc.id;
            option.textContent = data.name + " - " + data.gstin; // Display buyer name and GSTIN
            buyerSelect.appendChild(option);
        });
    }).catch((error) => {
        console.error("Error loading buyers:", error);
        buyerSelect.innerHTML = '<option value="">Error loading buyers</option>';
    });
}

// Load buyers when the page loads
window.onload = loadBuyers;
