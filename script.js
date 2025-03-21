document.getElementById("buyerDropdown").addEventListener("change", function() {
    let selectedBuyer = this.value;
    db.collection("buyers").where("gstin", "==", selectedBuyer).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            document.getElementById("buyerAddress").textContent = data.address;
            document.getElementById("buyerCity").textContent = data.city;
            document.getElementById("buyerState").textContent = data.state;
            document.getElementById("buyerPIN").textContent = data.pin;
            document.getElementById("buyerGST").textContent = data.gstin;
            document.getElementById("buyerPAN").textContent = data.pan;
        });
    });
});
