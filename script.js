import { fetchBuyers, addBuyer } from "./firebase.js";

// Function to load buyers into the dropdown
async function loadBuyers() {
    const buyerSelect = document.getElementById("buyerSelect");
    buyerSelect.innerHTML = '<option value="">Loading...</option>';

    try {
        const buyers = await fetchBuyers();
        buyerSelect.innerHTML = '<option value="">Select a Buyer</option>';
        buyers.forEach((buyer) => {
            const option = document.createElement("option");
            option.value = buyer.id;
            option.textContent = buyer.name + " - " + buyer.gstin;
            buyerSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading buyers:", error);
        buyerSelect.innerHTML = '<option value="">Error loading buyers</option>';
    }
}

// Show Buyer Form
document.getElementById("add-buyer").addEventListener("click", () => {
    document.getElementById("buyer-form").style.display = "block";
});

// Cancel Buyer Form
document.getElementById("cancel-buyer").addEventListener("click", () => {
    document.getElementById("buyer-form").style.display = "none";
});

// Save New Buyer to Firestore
document.getElementById("save-buyer").addEventListener("click", async () => {
    const buyerName = document.getElementById("buyerName").value.trim();
    const buyerGSTIN = document.getElementById("buyerGSTIN").value.trim();
    const buyerAddress = document.getElementById("buyerAddress").value.trim();
    const buyerCity = document.getElementById("buyerCity").value.trim();
    const buyerPin = document.getElementById("buyerPin").value.trim();
    const buyerState = document.getElementById("buyerState").value.trim();
    const buyerPAN = document.getElementById("buyerPAN").value.trim();

    if (!buyerName || !buyerGSTIN) {
        alert("Buyer Name and GSTIN are required!");
        return;
    }

    const newBuyer = {
        name: buyerName,
        gstin: buyerGSTIN,
        address: buyerAddress,
        city: buyerCity,
        pin: buyerPin,
        state: buyerState,
        pan: buyerPAN
    };

    try {
        await addBuyer(newBuyer);
        alert("Buyer added successfully!");
        document.getElementById("buyer-form").style.display = "none";
        loadBuyers(); // Reload buyer list
    } catch (error) {
        console.error("Error adding buyer:", error);
        alert("Error adding buyer.");
    }
});

// Load buyers when the page loads
window.onload = loadBuyers;
