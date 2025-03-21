// Version 00002
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",
  authDomain: "hk-invoice-new.firebaseapp.com",
  projectId: "hk-invoice-new",
  storageBucket: "hk-invoice-new.firebasestorage.app",
  messagingSenderId: "433334964621",
  appId: "1:433334964621:web:d4c679cf4a3193457a6dc4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch buyers from Firestore
async function fetchBuyers() {
  const buyersCollection = collection(db, "buyers");
  const buyersSnapshot = await getDocs(buyersCollection);
  const buyersList = buyersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return buyersList;
}

// Function to add a new buyer to Firestore
async function addBuyer(buyerData) {
  const buyersCollection = collection(db, "buyers");
  await addDoc(buyersCollection, buyerData);
}

// Function to generate the next invoice number
async function generateInvoiceNumber() {
  const invoicesCollection = collection(db, "invoices");
  const lastInvoiceQuery = query(invoicesCollection, orderBy("invoiceNumber", "desc"), limit(1));
  const lastInvoiceSnapshot = await getDocs(lastInvoiceQuery);
  let nextInvoiceNumber = 1;

  if (!lastInvoiceSnapshot.empty) {
    const lastInvoice = lastInvoiceSnapshot.docs[0].data();
    nextInvoiceNumber = lastInvoice.invoiceNumber + 1;
  }

  return nextInvoiceNumber;
}

// Export functions for use in other files
export { db, fetchBuyers, addBuyer, generateInvoiceNumber };
