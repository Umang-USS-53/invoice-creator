document.addEventListener("DOMContentLoaded", function () {
    const buyerDropdown = document.getElementById("buyerName");
    const buyerDetailsFields = {
        address: document.getElementById("buyerAddress"),
        city: document.getElementById("buyerCity"),
        state: document.getElementById("buyerState"),
        pin: document.getElementById("buyerPIN"),
        gst: document.getElementById("buyerGST"),
        pan: document.getElementById("buyerPAN"),
    };
    const goodsTable = document.getElementById("goodsTable").getElementsByTagName('tbody')[0];

    // Fetch buyers from Firestore
    function fetchBuyers() {
        firebase.firestore().collection("hk-invoice-new").get().then((querySnapshot) => {
            buyerDropdown.innerHTML = `<option value="">Select Buyer</option>`;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const optionText = `${data.name} - ${data.gstin}`;
                const option = new Option(optionText, doc.id);
                buyerDropdown.appendChild(option);
            });
        });
    }

    // Fetch and autofill buyer details
    buyerDropdown.addEventListener("change", function () {
        const selectedBuyerId = this.value;
        if (selectedBuyerId) {
            firebase.firestore().collection("hk-invoice-new").doc(selectedBuyerId).get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    buyerDetailsFields.address.textContent = data.address;
                    buyerDetailsFields.city.textContent = data.city;
                    buyerDetailsFields.state.textContent = data.state;
                    buyerDetailsFields.pin.textContent = data.pin;
                    buyerDetailsFields.gst.textContent = data.gstin;
                    buyerDetailsFields.pan.textContent = data.pan;

                    // Update Place of Supply
                    document.getElementById("placeOfSupply").textContent = data.state;
                }
            });
        } else {
            Object.values(buyerDetailsFields).forEach(field => field.textContent = "");
            document.getElementById("placeOfSupply").textContent = "";
        }
    });

    // Generate Invoice Number
    function generateInvoiceNumber() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        document.getElementById("invoiceNumber").value = `HK-001/${month}-${year}`;
    }

    // Add New Line Item
    document.getElementById("addLineItem").addEventListener("click", function () {
        const row = goodsTable.insertRow();
        const lotCell = row.insertCell(0);
        const descriptionCell = row.insertCell(1);
        const hsnCell = row.insertCell(2);
        const unitCell = row.insertCell(3);
        const quantityCell = row.insertCell(4);
        const rateCell = row.insertCell(5);
        const amountCell = row.insertCell(6);
        const cgstCell = row.insertCell(7);
        const sgstCell = row.insertCell(8);
        const igstCell = row.insertCell(9);

        lotCell.innerHTML = `<input type="text" class="lotNo">`;
        descriptionCell.innerHTML = `
            <select class="description">
                <option value="">Select</option>
                <option value="Cut and Polished Diamonds">Cut and Polished Diamonds</option>
                <option value="Gold">Gold</option>
                <option value="Jewellery">Jewellery</option>
            </select>
        `;
        hsnCell.textContent = "";
        unitCell.textContent = "";
        quantityCell.innerHTML = `<input type="number" class="quantity" step="0.01">`;
        rateCell.innerHTML = `<input type="number" class="rate">`;
        amountCell.textContent = "0";
        cgstCell.textContent = "0";
        sgstCell.textContent = "0";
        igstCell.textContent = "0";

        row.querySelector(".description").addEventListener("change", updateHSNUnit);
        row.querySelector(".quantity").addEventListener("input", updateCalculations);
        row.querySelector(".rate").addEventListener("input", updateCalculations);
    });

    // Update HSN & Unit based on Description
    function updateHSNUnit() {
        const description = this.value;
        const row = this.parentElement.parentElement;
        const hsnCell = row.cells[2];
        const unitCell = row.cells[3];

        if (description === "Cut and Polished Diamonds") {
            hsnCell.textContent = "71023910";
            unitCell.textContent = "CTS";
        } else if (description === "Gold") {
            hsnCell.textContent = "71081300";
            unitCell.textContent = "GMS";
        } else if (description === "Jewellery") {
            hsnCell.textContent = "71131910";
            unitCell.textContent = "NOS";
        }
    }

    // Update Amount & Taxes
    function updateCalculations() {
        let totalQty = 0, taxableValue = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0;
        const buyerGST = document.getElementById("buyerGST").textContent;
        const isCGSTSGST = buyerGST.startsWith("27");

        document.querySelectorAll("#goodsTable tbody tr").forEach(row => {
            const qty = parseFloat(row.querySelector(".quantity").value) || 0;
            const rate = parseFloat(row.querySelector(".rate").
