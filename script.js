// Firebase configuration (replace with your actual Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyDCk3zgML...",
  authDomain: "hk-invoice-new.firebaseapp.com",
  projectId: "hk-invoice-new",
  storageBucket: "hk-invoice-new.appspot.com",
  messagingSenderId: "433334964621",
  appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to fetch buyers from Firestore and populate dropdown
function loadBuyers() {
  const buyerSelect = document.getElementById("buyerSelect");
  buyerSelect.innerHTML = "<option value=''>Select Buyer</option>"; // Reset dropdown

  db.collection("buyers").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let buyer = doc.data();
      let option = document.createElement("option");
      option.value = doc.id;
      option.textContent = buyer.name + " - " + buyer.city;
      buyerSelect.appendChild(option);
    });
  }).catch((error) => {
    console.error("Error loading buyers: ", error);
  });
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", loadBuyers);
