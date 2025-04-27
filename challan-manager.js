// challan-manager.js

// Initialize Firebase (if not already initialized)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const challansTable = document.getElementById('challansTable').getElementsByTagName('tbody')[0];

function displayChallans() {
    db.collection('challans').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const challan = doc.data();

            // Format challanDate to dd/mm/yyyy
            const date = new Date(challan.challanDate);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            const row = challansTable.insertRow();
            row.insertCell(0).textContent = challan.challanNumber;
            row.insertCell(1).textContent = formattedDate;
            row.insertCell(2).textContent = challan.buyerName; // Assuming you save buyerName in your challan data
            row.insertCell(3).textContent = challan.totalQuantity; // Assuming you save totalQuantity
            row.insertCell(4).innerHTML = `<button onclick="viewChallanDetails('${doc.id}')">View Details</button>`;
        });
    });
}

function viewChallanDetails(challanId) {
    db.collection('challans').doc(challanId).get().then((doc) => {
        if (doc.exists) {
            const challan = doc.data();
            displayDetailedChallan(challan);
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.error('Error getting document:', error);
    });
}

function displayDetailedChallan(challan) {
    const modal = document.getElementById('challanDetailsModal');
    const modalContent = document.getElementById('challanDetailsContent');
    const closeBtn = document.querySelector('.close');

    // Format challanDate to dd/mm/yyyy
    const date = new Date(challan.challanDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    modalContent.innerHTML = `
        <h2>Challan Details</h2>
        <p><strong>Challan Number:</strong> ${challan.challanNumber}</p>
        <p><strong>Challan Date:</strong> ${formattedDate}</p>
        <p><strong>Consignee Name:</strong> ${challan.buyerName}</p>
        <p><strong>Consignee GST:</strong> ${challan.buyerGST}</p>
        <p><strong>Place of Destination:</strong> ${challan.placeOfDestination}</p>
        <p><strong>Mode of Delivery:</strong> ${challan.modeOfDelivery}</p>
        <p><strong>Details of Transporter:</strong> ${challan.detailsOfTransporter}</p>
        <p><strong>Purpose of Movement:</strong> ${challan.purposeOfMovement}</p>
        <h3>Items:</h3>
        <ul>
            ${challan.items.map(item => `
                <li>
                    <strong>Description:</strong> ${item.description},
                    <strong>Quantity:</strong> ${item.quantity},
                    <strong>Rate:</strong> ${item.rate},
                    <strong>Amount:</strong> ${item.amount}
                </li>
            `).join('')}
        </ul>
        <p><strong>Total Quantity:</strong> ${challan.totalQuantity}</p>
        <p><strong>Taxable Value:</strong> ${challan.taxableValue}</p>
        <p><strong>Invoice Value:</strong> ${challan.invoiceValue}</p>
        <p><strong>Amount in Words:</strong> ${challan.amountInWords}</p>
        <p><strong>Challan Terms and Conditions:</strong></p>
        <div>${Object.values(challan.termsAndConditions).map(term => `<p>${term}</p>`).join('')}</div>
    `;

    modal.style.display = 'block';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

displayChallans();
