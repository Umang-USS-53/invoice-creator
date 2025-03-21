const firebaseConfig = {
    apiKey: "AIzaSyDCk3z...",
    authDomain: "hk-invoice-new.firebaseapp.com",
    projectId: "hk-invoice-new",
    storageBucket: "hk-invoice-new.appspot.com",
    messagingSenderId: "433334964621",
    appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch Buyers
const buyerDropdown = document.getElementById("buyerDropdown");

function loadBuyers() {
    db.collection("buyers").get().then((querySnapshot) => {
        buyerDropdown.innerHTML = "<option value=''>Select Buyer</option>";
        querySnapshot.forEach((doc) => {
            let buyer = doc.data();
            let option = document.createElement("option");
            option.value = buyer.gstin;
            option.textContent = `${buyer.name} - ${buyer.gstin}`;
            buyerDropdown.appendChild(option);
        });
    });
}

// Add Buyer
document.getElementById("saveBuyerBtn").addEventListener("click", function() {
    let newBuyer = {
        name: document.getElementById("newBuyerName").value,
        gstin: document.getElementById("newBuyerGST").value,
        address: document.getElementById("newBuyerAddress").value,
        city: document.getElementById("newBuyerCity").value,
        state: document.getElementById("newBuyerState").value,
        pin: document.getElementById("newBuyerPIN").value,
        pan: document.getElementById("newBuyerPAN").value
    };

    db.collection("buyers").add(newBuyer).then(() => {
        loadBuyers();
        alert("Buyer Added Successfully!");
    });
});

loadBuyers();
