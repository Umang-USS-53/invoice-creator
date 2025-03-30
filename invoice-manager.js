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
    db.collection('invoices').doc(invoiceId).get().then((doc) => {
        if (doc.exists) {
            const invoice = doc.data();
            displayDetailedInvoice(invoice);
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.error('Error getting document:', error);
    });
}

function displayDetailedInvoice(invoice) {
    // Create a modal or a separate section to display the invoice details
    const detailsContainer = document.createElement('div');
    detailsContainer.innerHTML = `
        <h2>Invoice Details</h2>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Invoice Date:</strong> ${invoice.invoiceDate}</p>
        <p><strong>Buyer Name:</strong> ${invoice.buyerName}</p>
        <p><strong>Buyer GST:</strong> ${invoice.buyerGST}</p>
        <p><strong>Terms of Payment:</strong> ${invoice.termsOfPayment}</p>
        <h3>Items:</h3>
        <ul>
            ${invoice.items.map(item => `
                <li>
                    <strong>Description:</strong> ${item.description},
                    <strong>Quantity:</strong> ${item.quantity},
                    <strong>Rate:</strong> ${item.rate},
                    <strong>Amount:</strong> ${item.amount}
                </li>
            `).join('')}
        </ul>
        <p><strong>Total Quantity:</strong> ${invoice.totalQuantity}</p>
        <p><strong>Taxable Value:</strong> ${invoice.taxableValue}</p>
        <p><strong>Invoice Value:</strong> ${invoice.invoiceValue}</p>
        <p><strong>Amount in Words:</strong> ${invoice.amountInWords}</p>
    `;

    // Append the details container to the body or a specific element
    document.body.appendChild(detailsContainer);
}

displayInvoices();
