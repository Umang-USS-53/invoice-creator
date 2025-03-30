// csv-export.js

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

function exportToCSV() {
    db.collection('invoices').get().then((querySnapshot) => {
        const csvData = [];
        const header = [
            'Invoice Number', 'Invoice Date', 'Buyer Name', 'Buyer GST', 'Terms of Payment',
            'Lot No.', 'Description', 'HSN Code', 'Unit', 'Quantity', 'Rate', 'Amount',
            'CGST Rate', 'SGST Rate', 'IGST Rate', 'Total Quantity', 'Taxable Value',
            'CGST Value', 'SGST Value', 'IGST Value', 'Invoice Value', 'Amount in Words'
        ];
        csvData.push(header.join(','));

        querySnapshot.forEach((doc) => {
            const invoice = doc.data();
            invoice.items.forEach((item) => {
                const row = [
                    invoice.invoiceNumber, invoice.invoiceDate, invoice.buyerName, invoice.buyerGST, invoice.termsOfPayment,
                    item.lotNo, item.description, item.hsnCode, item.unit, item.quantity, item.rate, item.amount,
                    item.cgstRate, item.sgstRate, item.igstRate, invoice.totalQuantity, invoice.taxableValue,
                    invoice.cgstValue, invoice.sgstValue, invoice.igstValue, invoice.invoiceValue, invoice.amountInWords
                ];
                csvData.push(row.join(','));
            });
        });

        const csvString = csvData.join('\n');
        downloadCSV(csvString);
    });
}

function downloadCSV(csvString) {
    const filename = 'invoices.csv';
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
