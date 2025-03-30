// csv-export.js

function exportToCSV() {
    console.log("exportToCSV() called");
    db.collection('invoices').get().then((querySnapshot) => {
        // ... (rest of the function) ...
        const csvString = csvData.join('\n');
        downloadCSV(csvString);
    });
}

function downloadCSV(csvString) {
    console.log("downloadCSV() called");
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
