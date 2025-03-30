// invoice-manager.js

// Initialize Firebase (if not already initialized)
const firebaseConfig = {
    apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",
    authDomain: "hk-invoice-new.firebaseapp.com",
    projectId: "hk-invoice-new",
    storageBucket: "hk-invoice-new.firebasestorage.app",
    messagingSenderId: "433334964621",
    appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const invoicesTable = document.getElementById('invoicesTable').getElementsByTagName('tbody')[0];

function displayInvoices() {
    db.collection('invoices').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const invoice = doc.data();
            const row = invoicesTable.insertRow();
            row.insertCell(0).textContent = invoice.invoiceNumber;
            row.insertCell(1).textContent = invoice.invoiceDate;
            row.insertCell(2).textContent = invoice.buyerName;
            row.insertCell(3).textContent = invoice.invoiceValue;
            row.insertCell(4).innerHTML = '<button onclick="viewInvoiceDetails(\'' + doc.id + '\')">View Details</button>'; // Add View Details button
        });
    });
}

function viewInvoiceDetails(invoiceId) {
    // Implement view details logic here
    console.log('View details for invoice:', invoiceId);
}

displayInvoices();
