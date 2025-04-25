// dc-script.js


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

// dc-script.js (continued)


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

// dc-script.js (continued)


const buyerDetailsDiv = document.getElementById('buyerDetails');

const buyerAddressSpan = document.getElementById('buyerAddress');

const buyerCitySpan = document.getElementById('buyerCity');

const buyerStateSpan = document.getElementById('buyerState');

const buyerPINSpan = document.getElementById('buyerPIN');

const buyerGSTSpan = document.getElementById('buyerGST');

const buyerPANSpan = document.getElementById('buyerPAN');


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

// dc-script.js (continued)


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

// dc-script.js (continued)


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

// Part 3: preview function and event listener

document.addEventListener('DOMContentLoaded', () => {
    const previewChallanButton = document.getElementById('previewChallanButton');
    const invoicePreview = document.getElementById('invoicePreview'); // Keeping the ID as it is in dc-index.html
    const saveChallanButton = document.getElementById('saveChallanButton');

    previewChallanButton.addEventListener('click', previewChallan);

    saveChallanButton.addEventListener('click', () => {
        saveChallanData(); // We will define this function later
        // Logic for PDF generation can be added here later
    });
});


    function previewChallan() {
        console.log('Preview Challan button clicked');

        // Challan Details
        const challanNumberInput = document.getElementById('challanNumber').value;
        document.getElementById('previewInvoiceNumber').textContent = `HK-${challanNumberInput}/25-26`; // Using previewInvoiceNumber ID as it exists in your preview

        // Format Challan Date
        const challanDate = new Date(document.getElementById('challanDate').value);
        const day = String(challanDate.getDate()).padStart(2, '0');
        const month = String(challanDate.getMonth() + 1).padStart(2, '0');
        const year = challanDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        document.getElementById('previewInvoiceDate').textContent = formattedDate; // Using previewInvoiceDate ID as it exists in your preview

        // Detail of Receiver / Transporter
        document.getElementById('previewBuyerName').textContent = document.getElementById('buyerName').options[document.getElementById('buyerName').selectedIndex].text;
        document.getElementById('previewBuyerAddress').textContent = document.getElementById('buyerAddress').textContent;
        document.getElementById('previewBuyerCity').textContent = document.getElementById('buyerCity').textContent;
        document.getElementById('previewBuyerState').textContent = document.getElementById('buyerState').textContent;
        document.getElementById('previewBuyerPIN').textContent = document.getElementById('buyerPIN').textContent;
        document.getElementById('previewBuyerGST').textContent = document.getElementById('buyerGST').textContent;
        document.getElementById('previewBuyerPAN').textContent = document.getElementById('buyerPAN').textContent;

        // The following lines for termsOfPayment and placeOfSupply are omitted
        // as these elements are not in your dc-index.html

        // Seller Details (Static Data)
        document.getElementById('previewSellerName').textContent = "HK & SONS";
        document.getElementById('previewSellerAddress').textContent = "B-803 ANMOL EXCEL ESTATE OFF:- S V ROAD, GOREGAON WEST, MUMBAI:-400062";
        document.getElementById('previewSellerState').textContent = "Maharashtra";
        document.getElementById('previewSellerEmail').textContent = "hkandsons18@gmail.com";
        document.getElementById('previewSellerGST').textContent = "27AALFH1384H1Z7";
        document.getElementById('previewSellerPAN').textContent = "AALFH1384H";

    
        // Item Details
        const previewItemRows = document.getElementById('previewItemRows');
        previewItemRows.innerHTML = '';

        const itemRowsData = document.querySelectorAll('#itemRows tr');

        itemRowsData.forEach(row => {
            const previewRow = document.createElement('tr');
            const descriptionSelect = row.querySelector('.description');
            const descriptionText = descriptionSelect.options[descriptionSelect.selectedIndex].text;
            const quantityInput = row.querySelector('.quantity');
            const quantityValue = quantityInput ? quantityInput.value : '0'; // Handle cases where input might not be found
            const hsnCodeCell = row.cells[2];
            const hsnCodeText = hsnCodeCell ? hsnCodeCell.textContent : '';
            const unitCell = row.cells[3];
            const unitText = unitCell ? unitCell.textContent : '';
            const rateInput = row.querySelector('.rate');
            const rateValue = rateInput ? rateInput.value : '0';
            const amountCell = row.cells[6];
            const amountText = amountCell ? amountCell.textContent : '0';
            const cgstRateCell = row.cells[7];
            const cgstRateText = cgstRateCell ? cgstRateCell.textContent : '';
            const sgstRateCell = row.cells[8];
            const sgstRateText = sgstRateCell ? sgstRateCell.textContent : '';
            const igstRateCell = row.cells[9];
            const igstRateText = igstRateCell ? igstRateCell.textContent : '';

            previewRow.innerHTML = `
                <td>${row.cells[0].textContent}</td>
                <td>${descriptionText}</td>
                <td>${hsnCodeText}</td>
                <td>${unitText}</td>
                <td>${quantityValue}</td>
                <td>${rateValue}</td>
                <td>${amountText}</td>
                <td>${cgstRateText}</td>
                <td>${sgstRateText}</td>
                <td>${igstRateText}</td>
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
        // Optionally include the following line if you have a corresponding element in your preview
        document.getElementById('previewAmountInWords').textContent = document.getElementById('amountInWords').textContent;

        invoicePreview.style.display = 'block';
        document.getElementById('saveChallanButton').style.display = 'block';
}
        function generateTotalsTable(doc, startY) {
        const margin = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const availableWidth = pageWidth - margin * 2; // Available width within margins
        const col1Width = availableWidth * 0.7; // Adjust percentage as needed
        const col2Width = availableWidth * 0.3; // Adjust percentage as needed
        const cellHeight = 5; // Adjust as needed
        let currentY = startY;
    
        // Get Item Details from the first line item
        const itemRows = document.querySelectorAll('#previewItemRows tr');
        let unit = '';
        let cgstRate = '';
        let sgstRate = '';
        let igstRate = '';

        if (itemRows.length > 0) {
            const cells = itemRows[0].querySelectorAll('td');
            if (cells.length >= 7) {
                unit = cells[3].textContent;
                cgstRate = cells[7] ? cells[7].textContent : '';
                sgstRate = cells[8] ? cells[8].textContent : '';
                igstRate = cells[9] ? cells[9].textContent : '';
            }
        }

        // Totals data with modified labels and details
        const totals = [
            { label: `Total Quantity (${unit})`, value: document.getElementById('previewTotalQuantity').textContent },
            { label: 'Taxable Value (INR)', value: document.getElementById('previewTaxableValue').textContent },
            { label: `CGST (${cgstRate})`, value: document.getElementById('previewCgstValue').textContent },
            { label: `SGST (${sgstRate})`, value: document.getElementById('previewSgstValue').textContent },
            { label: `IGST (${igstRate})`, value: document.getElementById('previewIgstValue').textContent },
            { label: 'Invoice Value (INR)', value: document.getElementById('previewInvoiceValue').textContent },
        ];

        totals.forEach(total => {
            doc.text(total.label, margin + col1Width, currentY + cellHeight / 2, { align: 'right', baseline: 'middle', fontSize: 10 }); // Right align label
            doc.text(total.value, margin + col1Width + col2Width-5, currentY + cellHeight / 2, { align: 'right', baseline: 'middle', fontSize: 10 }); // Right align value

       
            currentY += cellHeight;
        });

    return currentY;

    }

});
