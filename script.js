document.addEventListener("DOMContentLoaded", function () {
    const buyerDropdown = document.getElementById("buyerName");
    const invoiceDate = document.getElementById("invoiceDate");

    // Fetch Buyer Details When Selected
    buyerDropdown.addEventListener("change", async function () {
        const buyerId = buyerDropdown.value;
        if (!buyerId) return;

        const doc = await db.collection("buyers").doc(buyerId).get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById("buyerAddress").value = data.address;
            document.getElementById("buyerCity").value = data.city;
            document.getElementById("buyerState").value = data.state;
            document.getElementById("buyerPin").value = data.pin;
            document.getElementById("buyerGST").value = data.gstin;
            document.getElementById("buyerPAN").value = data.pan;
            document.getElementById("placeOfSupply").value = `${data.city}, ${data.state}`;
        }
    });

    // Generate Invoice Number
    invoiceDate.addEventListener("change", function () {
        const selectedDate = new Date(invoiceDate.value);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;

        let financialYear = "";
        if (month >= 4) {
            financialYear = `${year % 100}-${(year + 1) % 100}`;
        } else {
            financialYear = `${(year - 1) % 100}-${year % 100}`;
        }

        db.collection("invoices").orderBy("invoiceNumber", "desc").limit(1).get()
            .then(snapshot => {
                let nextNumber = "001";
                if (!snapshot.empty) {
                    const lastInvoice = snapshot.docs[0].data().invoiceNumber;
                    const lastNumber = parseInt(lastInvoice.split("/")[0].split("-")[1], 10);
                    nextNumber = String(lastNumber + 1).padStart(3, "0");
                }
                document.getElementById("invoiceNumber").value = `HK-${nextNumber}/${financialYear}`;
            });
    });

    // Handle Adding Goods Line Items
    document.getElementById("addItem").addEventListener("click", function () {
        const table = document.getElementById("goodsTable").querySelector("tbody");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td></td>
            <td><select><option>Cut and Polished Diamonds</option><option>Gold</option><option>Jewellery</option></select></td>
            <td></td>
            <td></td>
            <td><input type="number"></td>
            <td><input type="number"></td>
            <td></td>
            <td><button type="button" class="remove">X</button></td>
        `;
        table.appendChild(row);
    });

    // Remove Line Item
    document.getElementById("goodsTable").addEventListener("click", function (event) {
        if (event.target.classList.contains("remove")) {
            event.target.parentElement.parentElement.remove();
        }
    });
});
