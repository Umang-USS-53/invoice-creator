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

// script.js (continued)

const addItemButton = document.getElementById('addItemButton');
const itemRows = document.getElementById('itemRows');
let lotNumber = 1;

addItemButton.addEventListener('click', () => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${lotNumber}</td>
        <td>
            <select class="description">
                <option value="">Select Description</option>
                <option value="Cut and Polished Diamonds">Cut and Polished Diamonds</option>
                <option value="Gold">Gold</option>
                <option value="Jewellery">Jewellery</option>
            </select>
        </td>
        <td class="hsnCode"></td>
        <td class="unit"></td>
        <td><input type="number" class="quantity" value="0" step="0.01"></td>
        <td><input type="number" class="rate" value="0"></td>
        <td class="amount">0</td>
        <td class="cgstRate"></td>
        <td class="sgstRate"></td>
        <td class="igstRate"></td>
    `;
    itemRows.appendChild(row);
    lotNumber++;

    // Add event listeners to the new row's elements
    addEventListenersToRow(row);
});

function addEventListenersToRow(row) {
    const descriptionSelect = row.querySelector('.description');
    const quantityInput = row.querySelector('.quantity');
    const rateInput = row.querySelector('.rate');

    descriptionSelect.addEventListener('change', () => updateItemDetails(row));
    quantityInput.addEventListener('input', () => calculateAmount(row));
    rateInput.addEventListener('input', () => calculateAmount(row));
}

function updateItemDetails(row) {
    const description = row.querySelector('.description').value;
    const hsnCodeCell = row.querySelector('.hsnCode');
    const unitCell = row.querySelector('.unit');
    const cgstRateCell = row.querySelector('.cgstRate');
    const sgstRateCell = row.querySelector('.sgstRate');
    const igstRateCell = row.querySelector('.igstRate');

    let hsnCode = '';
    let unit = '';
    let cgstRate = '';
    let sgstRate = '';
    let igstRate = '';

    if (description === 'Cut and Polished Diamonds') {
        hsnCode = '71023910';
        unit = 'CTS';
        cgstRate = '0.75%';
        sgstRate = '0.75%';
        igstRate = '1.5%';
    } else if (description === 'Gold') {
        hsnCode = '71081300';
        unit = 'GMS';
        cgstRate = '1.5%';
        sgstRate = '1.5%';
        igstRate = '3%';
    } else if (description === 'Jewellery') {
        hsnCode = '71131910';
        unit = 'NOS';
        cgstRate = '1.5%';
        sgstRate = '1.5%';
        igstRate = '3%';
    }

    hsnCodeCell.textContent = hsnCode;
    unitCell.textContent = unit;
    cgstRateCell.textContent = cgstRate;
    sgstRateCell.textContent = sgstRate;
    igstRateCell.textContent = igstRate;

    calculateAmount(row); // Recalculate amount after description change
}

function calculateAmount(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value);
    const rate = parseFloat(row.querySelector('.rate').value);
    const amountCell = row.querySelector('.amount');
    const amount = quantity * rate;
    amountCell.textContent = amount.toFixed(2);
    calculateTotals();
}

// script.js (continued)

function calculateTotals() {
    const quantityInputs = document.querySelectorAll('.quantity');
    const amountCells = document.querySelectorAll('.amount');
    const buyerGST = document.getElementById('buyerGST').textContent;

    let totalQuantity = 0;
    let taxableValue = 0;

    quantityInputs.forEach(input => {
        totalQuantity += parseFloat(input.value);
    });

    amountCells.forEach(cell => {
        taxableValue += parseFloat(cell.textContent);
    });

    document.getElementById('totalQuantity').textContent = totalQuantity.toFixed(2);
    document.getElementById('taxableValue').textContent = taxableValue.toFixed(2);

    calculateGST(taxableValue, buyerGST); // Call GST calculation function
}

// script.js (continued)

function calculateGST(taxableValue, buyerGST) {
    let cgstValue = 0;
    let sgstValue = 0;
    let igstValue = 0;

    const cgstRates = document.querySelectorAll('.cgstRate');
    const sgstRates = document.querySelectorAll('.sgstRate');
    const igstRates = document.querySelectorAll('.igstRate');

    console.log("Buyer GST:", buyerGST); //add console log

    if (buyerGST.startsWith('27')) {
        let totalCgst = 0;
        let totalSgst = 0;
        cgstRates.forEach(rate => {
            totalCgst += taxableValue * (parseFloat(rate.textContent.replace('%','')) / 100);
        });
        sgstRates.forEach(rate => {
            totalSgst += taxableValue * (parseFloat(rate.textContent.replace('%','')) / 100);
        });
        cgstValue = totalCgst;
        sgstValue = totalSgst;
    } else {
        let totalIgst = 0;
        igstRates.forEach(rate => {
            totalIgst += taxableValue * (parseFloat(rate.textContent.replace('%','')) / 100);
        });
        igstValue = totalIgst;
    }

    document.getElementById('cgstValue').textContent = cgstValue.toFixed(2);
    document.getElementById('sgstValue').textContent = sgstValue.toFixed(2);
    document.getElementById('igstValue').textContent = igstValue.toFixed(2);

    const invoiceValue = taxableValue + cgstValue + sgstValue + igstValue;
    document.getElementById('invoiceValue').textContent = invoiceValue.toFixed(2);

    calculateAmountInWords(invoiceValue); // Call amount in words function
}

// script.js (continued)

function calculateAmountInWords(amount) {
    // Implement amount in words conversion here
    // For now, let's just display the number
    document.getElementById('amountInWords').textContent = amount.toFixed(2);
}
