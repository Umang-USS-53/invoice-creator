function generatePDF(invoiceData) {
    const {
        jsPDF
    } = window.jspdf;
    const doc = new jsPDF();

    // Define page margins (in points)
    const margin = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
    };

    // Define default text style
    const defaultFont = "helvetica";
    const defaultFontSize = 10;

    doc.setFont(defaultFont);
    doc.setFontSize(defaultFontSize);

    // Function to add text with line breaks and alignment
    function addText(text, x, y, options = {}) {
        const {
            maxWidth,
            align,
            font,
            fontSize,
            style,
        } = options;

        if (font) doc.setFont(font);
        if (fontSize) doc.setFontSize(fontSize);
        if (style) doc.setFont(undefined, style);

        if (maxWidth) {
            const lines = doc.splitTextToSize(text, maxWidth);
            let textY = y;
            lines.forEach((line) => {
                let textX = x;
                if (align === "right") {
                    textX = maxWidth ? x + maxWidth - doc.getTextWidth(line) : x;
                } else if (align === "center") {
                    textX = maxWidth ? x + (maxWidth - doc.getTextWidth(line)) / 2 : x;
                }
                doc.text(line, textX, textY);
                textY += defaultFontSize * 1.2; // Adjust line height
            });
        } else {
            let textX = x;
            if (align === "right") {
                textX = x - doc.getTextWidth(text);
            } else if (align === "center") {
                textX = x - doc.getTextWidth(text) / 2;
            }
            doc.text(text, textX, y);
        }

        doc.setFont(defaultFont);
        doc.setFontSize(defaultFontSize);
        doc.setFont(undefined, "normal"); // Reset style
    }

    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width

    // "LOCAL TAX INVOICE"
    doc.setFontSize(14);
    addText("LOCAL TAX INVOICE", pageWidth / 2, margin.top, {
        align: "center",
        style: "bold",
    });
    doc.setFontSize(defaultFontSize);

    let currentY = margin.top + 10; // Start Y position for header content

    // Seller Details
    addText("Seller - " + invoiceData.sellerName, margin.left, currentY);
    currentY += 5;
    addText(invoiceData.sellerAddress, margin.left, currentY, {
        maxWidth: pageWidth / 2 - margin.left - 5,
    });
    currentY += 5;
    addText("Email: " + invoiceData.sellerEmail, margin.left, currentY);
    currentY += 5;
    addText("GSTIN: " + invoiceData.sellerGST + " PAN: " + invoiceData.sellerPAN, margin.left, currentY);

    currentY = margin.top + 10; // Reset Y for buyer details

    // Buyer Details
    addText("Buyer - " + invoiceData.buyerName, pageWidth / 2, currentY, {
        align: "left",
    });
    currentY += 5;
    addText(invoiceData.buyerAddress, pageWidth / 2, currentY, {
        align: "left",
        maxWidth: pageWidth / 2 - margin.right - 5,
    });
    currentY += 5;
    addText("City: " + invoiceData.buyerCity + " State: " + invoiceData.buyerState + " PIN: " + invoiceData.buyerPIN, pageWidth / 2, currentY, {
        align: "left",
    });
    currentY += 5;
    addText("GSTIN: " + invoiceData.buyerGST + " PAN: " + invoiceData.buyerPAN, pageWidth / 2, currentY, {
        align: "left",
    });
    currentY += 5;
    addText("Place of Supply: " + invoiceData.placeOfSupply, pageWidth / 2, currentY, {
        align: "left",
    });

    // Date
    addText("Date: " + invoiceData.invoiceDate, pageWidth - margin.right, margin.top + 10, {
        align: "right",
    });

    // ... (We will add the rest of the PDF generation here)

    doc.save("invoice.pdf");
}
