import { fetchBuyers, addBuyer } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
    const buyerSelect = document.getElementById("buyerSelect");
    const addBuyerBtn = document.getElementById("addBuyerBtn");
    const addLineItemBtn = document.getElementById("addLineItemBtn");
    const lineItemsBody = document.getElementById("lineItemsBody");
    const totalAmountEl = document.getElementById("totalAmount");

    // Fetch buyers and populate dropdown
    async function loadBuyers() {
        const buyers = await fetchBuyers();
        buyerSelect.innerHTML = '<option value="">Select Buyer</option>';
        buyers.forEach(buyer => {
            const option = document.createElement("option");
            option.value = buyer.gstin;
            option.textContent = `${buyer.name} - ${buyer.gstin}`;
            buyerSelect.appendChild(option);
        });
    }

    await loadBuyers();

    // Add new buyer logic
    addBuyerBtn.addEventListener("click", () => {
        const name = prompt("Enter Buyer Name:");
        const gstin = prompt("Enter Buyer GSTIN:");
        const address = prompt("Enter Buyer Address:");
        const city = prompt("Enter Buyer City:");
        const pin = prompt("Enter Buyer PIN:");
        const state = prompt("Enter Buyer State:");
        const pan = prompt("Enter Buyer PAN:");

        if (name && gstin) {
            addBuyer({ name, gstin, address, city, pin, state, pan }).then(() => {
                alert("Buyer added successfully!");
                loadBuyers();
            });
        }
    });

    // Function to calculate GST
    function calculateGST(buyerGST, amount) {
        if (buyerGST.startsWith("27")) {
            return amount * 0.09 * 2; // CGST + SGST
        } else {
            return amount * 0.18; // IGST
        }
    }

    // Function to add a new line item
    function addLineItem() {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="text" class="description"></td>
            <td><input type="number" class="quantity" step="0.01" value="1"></td>
            <td><input type="number" class="rate" value="0"></td>
            <td class="gst">0.00</td>
            <td class="total">0.00</td>
            <td><button class="removeItemBtn">❌</button></td>
        `;

        lineItemsBody.appendChild(row);
        updateTotals();

        // Attach event listeners
        row.querySelector(".quantity").addEventListener("input", updateTotals);
        row.querySelector(".rate").addEventListener("input", updateTotals);
        row.querySelector(".removeItemBtn").addEventListener("click", () => {
            row.remove();
            updateTotals();
        });
    }

    addLineItemBtn.addEventListener("click", addLineItem);

    // Update totals dynamically
    function updateTotals() {
        let totalAmount = 0;
        document.querySelectorAll("#lineItemsBody tr").forEach(row => {
            const quantity = parseFloat(row.querySelector(".quantity").value) || 0;
            const rate = parseFloat(row.querySelector(".rate").value) || 0;
            const buyerGST = buyerSelect.value;

            const amount = quantity * rate;
            const gstAmount = calculateGST(buyerGST, amount);
            const total = amount + gstAmount;

            row.querySelector(".gst").textContent = gstAmount.toFixed(2);
            row.querySelector(".total").textContent = total.toFixed(2);
            totalAmount += total;
        });

        totalAmountEl.textContent = totalAmount.toFixed(2);
    }

    buyerSelect.addEventListener("change", updateTotals);
});
