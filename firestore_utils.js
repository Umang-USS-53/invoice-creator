// firestore_utils.js

function saveInvoiceToFirestore(invoiceData) {
    // Add timestamp and userId
    invoiceData.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    invoiceData.userId = 'hksons';

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Saving invoice...';
    loadingIndicator.classList.add("loading-indicator")
    document.body.appendChild(loadingIndicator);

    db.collection('invoices').add(invoiceData)
        .then(() => {
            // Remove loading indicator
            loadingIndicator.remove();

            // Show success message
            alert('Invoice successfully created and saved.');
        })
        .catch((error) => {
            // Remove loading indicator
            loadingIndicator.remove();

            console.error('Error saving invoice:', error);
            alert('Failed to save invoice.');
        });
}
