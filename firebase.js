const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch Buyer Data and Populate Dropdown
async function loadBuyers() {
    const buyerDropdown = document.getElementById("buyerName");
    buyerDropdown.innerHTML = "<option value=''>Select Buyer</option>";

    const snapshot = await db.collection("buyers").get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = `${data.name} - ${data.gstin}`;
        buyerDropdown.appendChild(option);
    });
}

loadBuyers();
