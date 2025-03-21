document.addEventListener("DOMContentLoaded", function () {
    const buyerDropdown = document.getElementById("buyerDropdown");
    const addBuyerButton = document.getElementById("addBuyerButton");
    const addBuyerForm = document.getElementById("addBuyerForm");
    const saveBuyerButton = document.getElementById("saveBuyerButton");
    const invoiceBody = document.getElementById("invoiceBody");
    const addLineItemButton = document.getElementById("addLineItem");

    let lotCounter = 1; // Initialize lot counter

    // 🔹 Function to Load Buyers into Dropdown
    function loadBuyers() {
        db.collection("buyers").get().then((querySnapshot) => {
            buyerDropdown.innerHTML = '<option value="">Select Buyer</option>'; // Reset dropdown
            querySnapshot.forEach((doc) => {
                let buyerData = doc.data();
                let option = document.createElement("option");
                option.value = doc.id;
                option.textContent = `${buyerData.name} - ${buyerData.gstin}`;
                buyerDropdown.appendChild(option);
            });
        }).catch((error) => {
            console.error("Error loading buyers:", error);
        });
    }

    // 🔹 Load Buyers when Page Loads
    loadBuyers();

    // 🔹 Show Add Buyer Form
    addBuyerButton.addEventListener("click", () => {
        addBuyerForm.style.display = "block";
    });

    // 🔹 Save Buyer to Firestore
    saveBuyerButton.addEventListener("click", () => {
        const buyerName = document.getElementById("buyerName").value.trim();
        const buyerGST = document.getElementById("buyerGST").value.trim();
        const buyerAddress = document.getElementById("buyerAddress").value.trim();
        const buyerCity = document.getElementById("buyerCity").value.trim();
        const buyerState = document.getElementById("buyerState").value.trim();
        const buyerPin = document.getElementById("buyerPin").value.trim();
        const buyerPAN = document.getElementById("buyerPAN").value.trim();

        if (buyerName && buyerGST && buyerAddress && buyerCity && buyerState && buyerPin && buyerPAN) {
            db.collection("buyers").add({
                name: buyerName,
                gstin: buyerGST,
                address: buyerAddress,
                city: buyerCity,
                state: buyerState,
                pin: buyerPin,
                pan: buyerPAN
            }).then(() => {
                alert("Buyer added successfully!");
                addBuyerForm.style.display = "none"; // Hide form
                loadBuyers(); // Reload dropdown
            }).catch((error) => {
                console.error("Error adding buyer:", error);
            });
        } else {
            alert("Please fill all buyer details.");
        }
    });

    // 🔹 Add New Line Item
    addLineItemButton.addEventListener("click", () => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${lotCounter}</td>
            <td><select>
                <option value="Diamonds">Cut and Polished Diamonds</option>
                <option value="Gold">Gold</option>
                <option value="Jewellery">Jewellery</option>
            </select></td>
            <td><input type="number" step="0.01" class="quantity" placeholder="0.00"></td>
            <td><input type="number" class="rate" placeholder="Enter rate"></td>
            <td class="amount">0.00</td>
        `;

        invoiceBody.appendChild(row);
        lotCounter++; // Increment Lot No.
    });
});
