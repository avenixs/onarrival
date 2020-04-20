const PDFDocument = require('pdfkit');
const path = require("path");

const WordListPDF = (exercise, list) => {
    const pdf = new PDFDocument({
        margins: {
            top: 72,
            bottom: 20,
            left: 72,
            right: 72
        }
    }); 

    pdf.registerFont('Roboto', path.join(__dirname, "..", "..", "utils", "Roboto-Regular.ttf"));

    pdf.info.Title = "List of words for " + exercise.name;
    const logo = path.join(__dirname, "..", "..", 'public', 'media', "logo-small.png");

    pdf.image(logo, 490, 40, { fit: [60, 60], align: 'center', valign: 'top'});
    
    pdf.fontSize("20").font("Roboto").text("Word List", 90, 45, { align: "left" });
    pdf.fontSize("14").font("Roboto").text(exercise.name, 90, 80, { align: "left" });
    let height = 140;

    for(let i=0; i<list.length; i++) {
        pdf.fontSize("13").font("Roboto").text(eval(i+1) + ".", 115, height+2, { align: "left" });
        pdf.fontSize("14").font("Roboto").text(list[i].wordEnglish, 160, height, { align: "left" });
        pdf.fontSize("14").font("Roboto").text(list[i].wordForeign, 400, height, { align: "left" });
        pdf.fontSize("14").font("Roboto").text("______________________________________________________________________", 90, height+10, { align: "left" });
        height = height + 45;

        if(height > 720) {
            pdf.addPage();
            height = 60;
        }
    }

    pdf.end();

    return pdf;
};

exports.generatePDF = WordListPDF;