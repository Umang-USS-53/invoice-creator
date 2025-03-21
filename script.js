// script.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",
    authDomain: "hk-invoice-new.firebaseapp.com",
    projectId: "hk-invoice-new",
    storageBucket: "hk-invoice-new.firebasestorage.app",
    messagingSenderId: "433334964621",
    appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// script.js (continued)

const buyerDropdown = document.getElementById('buyerName');

db.collection('buyers').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const buyer = doc.data();
        const option = document.createElement('option');
        option.value = doc.id; // Use the document ID as the value
        option.textContent = `${buyer.name} - ${buyer.gstin}`;
        buyerDropdown.appendChild(option);
    });
});

// script.js (continued)

const buyerDetailsDiv = document.getElementById('buyerDetails');
const buyerAddressSpan = document.getElementById('buyerAddress');
const buyerCitySpan = document.getElementById('buyerCity');
const buyerStateSpan = document.getElementById('buyerState');
const buyerPINSpan = document.getElementById('buyerPIN');
const buyerGSTSpan = document.getElementById('buyerGST');
const buyerPANSpan = document.getElementById('buyerPAN');
const placeOfSupplySpan = document.getElementById('placeOfSupply');

buyerDropdown.addEventListener('change', (event) => {
    const buyerId = event.target.value;

    if (buyerId) {
        db.collection('buyers').doc(buyerId).get().then((doc) => {
            if (doc.exists) {
                const buyer = doc.data();
                buyerAddressSpan.textContent = buyer.address;
                buyerCitySpan.textContent = buyer.city;
                buyerStateSpan.textContent = buyer.state;
                buyerPINSpan.textContent = buyer.pin;
                buyerGSTSpan.textContent = buyer.gstin;
                buyerPANSpan.textContent = buyer.pan;
                placeOfSupplySpan.textContent = `${buyer.city}, ${buyer.state}`;
                buyerDetailsDiv.style.display = 'block';
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
    } else {
        buyerDetailsDiv.style.display = 'none';
    }
});

// script.js (continued)

const addBuyerButton = document.getElementById('addBuyerButton');
const newBuyerForm = document.getElementById('newBuyerForm');
const saveBuyerButton = document.getElementById('saveBuyerButton');

addBuyerButton.addEventListener('click', () => {
    newBuyerForm.style.display = 'block';
});

saveBuyerButton.addEventListener('click', () => {
    const newBuyerName = document.getElementById('newBuyerName').value;
    const newBuyerAddress = document.getElementById('newBuyerAddress').value;
    const newBuyerCity = document.getElementById('newBuyerCity').value;
    const newBuyerState = document.getElementById('newBuyerState').value;
    const newBuyerPIN = document.getElementById('newBuyerPIN').value;
    const newBuyerGST = document.getElementById('newBuyerGST').value;
    const newBuyerPAN = document.getElementById('newBuyerPAN').value;

    db.collection('buyers').add({
        name: newBuyerName,
        address: newBuyerAddress,
        city: newBuyerCity,
        state: newBuyerState,
        pin: newBuyerPIN,
        gstin: newBuyerGST,
        pan: newBuyerPAN,
    }).then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        newBuyerForm.style.display = 'none';
        // Refresh the buyer dropdown
        buyerDropdown.innerHTML = '<option value="">Select Buyer</option>';
        db.collection('buyers').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const buyer = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${buyer.name} - ${buyer.gstin}`;
                buyerDropdown.appendChild(option);
            });
        });

    }).catch((error) => {
        console.error('Error adding document: ', error);
    });
});

