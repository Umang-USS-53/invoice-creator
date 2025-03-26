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

let firebaseInitialized = false;

firebase.initializeApp(firebaseConfig);

if (!firebaseInitialized) {
    console.log("Firebase initialized");
    firebaseInitialized = true;
}
const db = firebase.firestore();

// script.js (continued)

const buyerDropdown = document.getElementById('buyerName');

function populateBuyerDropdown() {
    buyerDropdown.innerHTML = '<option value="">Select Buyer</option>';

    db.collection('buyers').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const buyer = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${buyer.name} - ${buyer.gstin}`;
            buyerDropdown.appendChild(option);
        });
    }).catch((error) => {
        console.error("Firestore query error:", error);
    });
}

populateBuyerDropdown();

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
    }).then(() => {
        newBuyerForm.style.display = 'none';
        populateBuyerDropdown();
    }).catch((error) => {
        console.error('Error adding document: ', error);
    });
});

// script.js (continued)

// Item Details
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

    addEventListenerToRow(row);
});

function addEventListenerToRow(row) {
    const descriptionSelect = row.querySelector('.description');
    const quantityInput = row.querySelector('.quantity');
    const rateInput = row.querySelector('.rate');

    descriptionSelect.addEventListener('change', () => {
        updateItemDetails(row);
        calculateAmount(row);
        calculateTotals();
    });
    quantityInput.addEventListener('input', () => {
        calculateAmount(row);
        calculateTotals();
    });
    rateInput.addEventListener('input', () => {
        calculateAmount(row);
        calculateTotals();
    });
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

    calculateAmount(row);
}

function calculateAmount(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value);
    const rate = parseFloat(row.querySelector('.rate').value);
    const amountCell = row.querySelector('.amount');
    const amount = quantity * rate;
    amountCell.textContent = amount.toFixed(2);
    calculateTotals();
}

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

    calculateGST(taxableValue, buyerGST);
}

function calculateGST(taxableValue, buyerGST) {
    let cgstValue = 0;
    let sgstValue = 0;
    let igstValue = 0;

    const itemRowsData = document.querySelectorAll('#itemRows tr');

    itemRowsData.forEach(row => {
        const amount = parseFloat(row.querySelector('.amount').textContent);
        const cgstRate = parseFloat(row.querySelector('.cgstRate').textContent.replace('%', '')) / 100;
        const sgstRate = parseFloat(row.querySelector('.sgstRate').textContent.replace('%', '')) / 100;
        const igstRate = parseFloat(row.querySelector('.igstRate').textContent.replace('%', '')) / 100;

        if (buyerGST.startsWith('27')) {
            cgstValue += amount * cgstRate;
            sgstValue += amount * sgstRate;
        } else {
            igstValue += amount * igstRate;
        }
    });

    document.getElementById('cgstValue').textContent = cgstValue.toFixed(2);
    document.getElementById('sgstValue').textContent = sgstValue.toFixed(2);
    document.getElementById('igstValue').textContent = igstValue.toFixed(2);

    const invoiceValue = taxableValue + cgstValue + sgstValue + igstValue;
    document.getElementById('invoiceValue').textContent = invoiceValue.toFixed(2);

    calculateAmountInWords(invoiceValue);
}

function calculateAmountInWords(amount) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convertLessThanThousand(number) {
        if (number === 0) return '';
        if (number < 10) return units[number] + ' ';
        if (number < 20) return teens[number - 10] + ' ';
        if (number < 100) return tens[Math.floor(number / 10)] + ' ' + units[number % 10] + ' ';
        return units[Math.floor(number / 100)] + ' Hundred ' + convertLessThanThousand(number % 100);
    }

    function convert(number) {
        if (number === 0) return 'Zero';
        const parts =;
        let crore = Math.floor(number / 10000000);
        let lakh = Math.floor((number % 10000000) / 100000);
        let thousand = Math.floor((number % 100000) / 1000);
        let remainder = number % 1000;

        if (crore) parts.push(convertLessThanThousand(crore) + ' Crore ');
        if (lakh) parts.push(convertLessThanThousand(lakh) + ' Lakh ');
        if (thousand) parts.push(convertLessThanThousand(thousand) + ' Thousand ');
        if (remainder) parts.push(convertLessThanThousand(remainder));

        return parts.join(' ').trim();
    }

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = convert(rupees).trim() + ' Rupees';

    if (paise > 0) {
        result += ' and ' + convert(paise).trim() + ' Paise';
    }

    document.getElementById('amountInWords').textContent = result + " Only";
}

// Part 3: previewInvoice function and event listener

document.addEventListener('DOMContentLoaded', () => {
    const previewInvoiceButton = document.getElementById('previewInvoiceButton');
    const invoicePreview = document.getElementById('invoicePreview');
    const saveInvoiceButton = document.getElementById('saveInvoiceButton');

    previewInvoiceButton.addEventListener('click', previewInvoice);

    saveInvoiceButton.addEventListener('click', () => {
        // No generatePDF() call here
    });

    function previewInvoice() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Define initial Y position after the 1-inch margin (72 points)
        let currentY = 72;
        const leftMargin = 36;
        const contentWidth = 523;

        // Helper functions
        function addText(doc, text, x, y, options) {
            const defaultOptions = {
                font: 'helvetica',
                fontSize: 10,
                fontWeight: 'normal',
                align: 'left'
            };

            const mergedOptions = { ...defaultOptions, ...options };

            doc.setFont(mergedOptions.font, mergedOptions.fontWeight);
            doc.setFontSize(mergedOptions.fontSize);

            if (mergedOptions.align === 'center') {
                const textWidth = doc.getTextWidth(text);
                x = (595 - textWidth) / 2;
            } else if (mergedOptions.align === 'right') {
                const textWidth = doc.getTextWidth(text);
                x = 595 - 36 - textWidth;
            }

            doc.text(text, x, y);
        }

        function addTable(doc, headers, data, x, y, columnWidths) {
            let currentY = y;

            doc.setFontWeight('bold');
            for (let i = 0; i < headers.length; i++) {
                doc.text(headers[i], x, currentY);
                x += columnWidths[i];
            }
            currentY += 5;
            doc.setFontWeight('normal');
            x = 36;

            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                for (let j = 0; j < row.length; j++) {
                    doc.text(String(row[j]), x, currentY);
                    x += columnWidths[j];
                }
                currentY += 5;
                x = 36;
            }
        }

        function addSectionHeader(doc, text, x, y) {
            addText(doc, text, x, y, { fontSize: 12, fontWeight: 'bold' });
            currentY += 5;
        const termsConditions = document.getElementById('previewTermsConditions').textContent.split('\n');
        for (let i = 0; i < termsConditions.length; i++) {
            addText(doc, termsConditions[i], leftMargin, currentY, { align: 'left' });
            currentY += 5;
        }
        currentY += 15;

        // 7. Signatures (Bottom, Centered)
        addText(doc, "RECEIVER'S STAMP & SIGNATURE", 0, 800, { align: 'center' });
        addText(doc, "FOR HK & SONS PARTNER/AUTHORISED SIGNATORY", 0, 820, { align: 'center' });

        doc.save("invoice.pdf");
    }
});
