// script.js (version00005)


// Initialize Firebase

const firebaseConfig = {

    apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",

    authDomain: "hk-invoice-new.firebaseapp.com",

    projectId: "hk-invoice-new",

    storageBucket: "hk-invoice-new.firebasestorage.app",

    messagingSenderId: "433334964621",

    appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"

};


let firebaseInitialized = false; // Add this line


firebase.initializeApp(firebaseConfig);

if (!firebaseInitialized) { // Add this check

    console.log("Firebase initialized");

    firebaseInitialized = true;

}

const db = firebase.firestore();


// script.js (continued)


const buyerDropdown = document.getElementById('buyerName');


function populateBuyerDropdown() {

    buyerDropdown.innerHTML = '<option value="">Select Buyer</option>'; // Reset dropdown


    db.collection('buyers').get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {

            const buyer = doc.data();

            const option = document.createElement('option');

            option.value = doc.id;

            option.textContent = `${buyer.name} - ${buyer.gstin}`;

            buyerDropdown.appendChild(option);

        });

    }).catch((error) => {

        console.error("Firestore query error:", error); // Added line

    });

}


populateBuyerDropdown(); // Call the function to populate the dropdown initially


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

    }).then(() => { // Removed docRef

        newBuyerForm.style.display = 'none';

        populateBuyerDropdown(); // Call the function to refresh the dropdown

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


    // Add event listeners to the new row's elements

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


function calculateGST(taxableValue, buyerGST) {

    let cgstValue = 0;

    let sgstValue = 0;

    let igstValue = 0;


    const itemRowsData = document.querySelectorAll('#itemRows tr'); // Get all item rows


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

        const parts = [];

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


    previewInvoiceButton.addEventListener('click', previewInvoice);


   function previewInvoice() {

    // Invoice Details

    document.getElementById('previewInvoiceNumber').textContent = document.getElementById('invoiceNumber').value;


    // Format Invoice Date

    const invoiceDate = new Date(document.getElementById('invoiceDate').value);

    const day = String(invoiceDate.getDate()).padStart(2, '0');

    const month = String(invoiceDate.getMonth() + 1).padStart(2, '0');

    const year = invoiceDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    document.getElementById('previewInvoiceDate').textContent = formattedDate;


    // Buyer Details

    document.getElementById('previewBuyerName').textContent = document.getElementById('buyerName').options[document.getElementById('buyerName').selectedIndex].text;

    document.getElementById('previewBuyerAddress').textContent = document.getElementById('buyerAddress').textContent;

    document.getElementById('previewBuyerCity').textContent = document.getElementById('buyerCity').textContent;

    document.getElementById('previewBuyerState').textContent = document.getElementById('buyerState').textContent;

    document.getElementById('previewBuyerPIN').textContent = document.getElementById('buyerPIN').textContent;

    document.getElementById('previewBuyerGST').textContent = document.getElementById('buyerGST').textContent;

    document.getElementById('previewBuyerPAN').textContent = document.getElementById('buyerPAN').textContent;

    document.getElementById('previewTermsOfPayment').textContent = document.getElementById('termsOfPayment').value;

    document.getElementById('previewPlaceOfSupply').textContent = document.getElementById('placeOfSupply').textContent;


    // Seller Details (Static Data)

    document.getElementById('previewSellerName').textContent = "HK & SONS";

    document.getElementById('previewSellerAddress').textContent = "B-803 ANMOL EXCEL ESTATE OFF:- S V ROAD, GOREGAON WEST, MUMBAI:-400062";

    document.getElementById('previewSellerState').textContent = "Maharashtra";

    document.getElementById('previewSellerEmail').textContent = "hkandsons18@gmail.com";

    document.getElementById('previewSellerGST').textContent = "27AALFH1384H1Z7";

    document.getElementById('previewSellerPAN').textContent = "AALFH1384H";


    // Static Bank Details

    document.getElementById('previewBankDetails').textContent = "BANK NAME: ICICI BANK, BRANCH: GOREGAON (WEST), CURRENT A/C NO: 643405052590, IFSC: ICIC0006434";


    // Static Payment Instructions

    document.getElementById('previewPaymentInstructions').textContent = "MAKE PAYMENT STRICTLY AS PER MENTIONED PAYMENT INSTRUCTIONS AND EXACT COMPANY NAME AS MENTIONED IN ORIGINAL ATTESTED INVOICE ONLY";


    // Static Terms & Conditions

    document.getElementById('previewTermsConditions').textContent = "1) The diamonds herein invoiced have been purchased from a legitimate source that is not involved in funding conflict and is in compliance with United Nations Resolutions.\n2) The diamonds herein invoiced are exclusively of natural origin and untreated based on personal knowledge and/or written guarantees provided by the supplier.\n3) The acceptance of goods herein invoiced will be as per the WFDB guidelines.\n4) To the best of our knowledge and/or written assurance from our suppliers, these diamonds have not been obtained in violation of applicable laws and are not organized from Mbada and Mrange Resources of Zimbabwe.\n5) I/We certify that our Registration Certificate under the GST Act, 2017 is valid on the date of sale and that this invoice is duly certified.\n6) Subject to Mumbai Jurisdiction.\n7) Provision for TCS under Section 206C (1H) will be charged separately through a debit note.";


    // Item Details

    const previewItemRows = document.getElementById('previewItemRows');

    previewItemRows.innerHTML = '';


    const itemRowsData = document.querySelectorAll('#itemRows tr');

    itemRowsData.forEach(row => {

        const previewRow = document.createElement('tr');

        const descriptionSelect = row.querySelector('.description');

        const descriptionText = descriptionSelect.options[descriptionSelect.selectedIndex].text;


        previewRow.innerHTML = `

            <td>${row.cells[0].textContent}</td>

            <td>${descriptionText}</td>

            <td>${row.cells[2].textContent}</td>

            <td>${row.cells[3].textContent}</td>

            <td>${row.cells[4].querySelector('input').value}</td>

            <td>${row.cells[5].querySelector('input').value}</td>

            <td>${row.cells[6].textContent}</td>

            <td>${row.cells[7].textContent}</td>

            <td>${row.cells[8].textContent}</td>

            <td>${row.cells[9].textContent}</td>

        `;


        previewItemRows.appendChild(previewRow);

    });
    

    // Totals

    document.getElementById('previewTotalQuantity').textContent = document.getElementById('totalQuantity').textContent;

    document.getElementById('previewTaxableValue').textContent = document.getElementById('taxableValue').textContent;

    document.getElementById('previewCgstValue').textContent = document.getElementById('cgstValue').textContent;

    document.getElementById('previewSgstValue').textContent = document.getElementById('sgstValue').textContent;

    document.getElementById('previewIgstValue').textContent = document.getElementById('igstValue').textContent;

    document.getElementById('previewInvoiceValue').textContent = document.getElementById('invoiceValue').textContent;

    document.getElementById('previewAmountInWords').textContent = document.getElementById('amountInWords').textContent;

    invoicePreview.style.display = 'block';
    document.getElementById('saveInvoiceButton').style.display = 'block'; // Make the Save Invoice button visible
}

async function saveInvoice() {
    try {
        generatePDF(); // Generate PDF after clicking "Save Invoice" button
    } catch (error) {
        console.error('Error generating PDF: ', error);
        alert('Error generating PDF.');
    }
}

function generatePDF() {
    const { jsPDF } = window.jspdf; // Access jsPDF from the window object
    const doc = new jsPDF();

    doc.text("Basic Invoice PDF", 10, 10); // Add some text to the PDF

    doc.save("basic-invoice.pdf"); // Save the PDF
}

    
}); 
