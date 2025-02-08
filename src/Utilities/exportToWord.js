import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

// import { quillToWord } from 'quill-to-word'; // Import quill-to-word
// import { QuillToWord } from 'quill-to-word';  // Correctly import the object

// import HTMLDocx from 'html-docx-js/dist/html-docx';
// import { saveAs } from 'file-saver';

export const exportToWord = quill => {

    // if (!quill) {
    //   console.log("Quill instance is not initialized yet.");
    //   return;
    // }

    // // Create an instance of QuillToWord and generate Word document
    // const quillToWordInstance = new QuillToWord(quill);
    // const wordDocument = quillToWordInstance.generateWordDocument();

    // // Save the Word document
    // saveAs(wordDocument, "document.docx");

    if (!quill) {
        console.log("Quill instance is not initialized yet.");
        return;
      }
    
      // Get Quill content in Delta format
      const quillContent = quill.getContents();
      console.log("Quill Content (Delta):", quillContent);
    
      if (!quillContent || !quillContent.ops) {
        console.log("Error: Quill content is empty or has no ops");
        return;
      }
      const documentContent = [];
      let currentTextRuns = [];
      // Parse Quill Delta content and convert to Word paragraphs
      quillContent.ops.forEach(op => {
        if (typeof op.insert === "string") {
          // Handle plain text insertion
          const textColor = op.attributes?.color || "#000000"; // Default to black (hex) if no color is specified
    
          // // Ensure color is a valid hex code (e.g., #RRGGBB format)
          // const validColor = /^#[0-9A-F]{6}$/i.test(color) ? color : "#000000"; 
          
          const textRun = new TextRun({
            text: op.insert,
            bold: op.attributes?.bold || false, // Apply bold if true
            italics: op.attributes?.italic || false, // Apply italic if true
            underline: op.attributes?.underline || false, // Apply underline if true
            color:textColor,
            shading: {
              type: "highlight",
              fill: op.attributes?.background?.replace("#", ""), // Apply highlight if specified
          },
          });
          currentTextRuns.push(textRun);
          if(op.insert.includes("\n"))
          {
            const paragraph = new Paragraph({
              children: [...currentTextRuns],
            });
      
            documentContent.push(paragraph);
            currentTextRuns = [];
          }
          
        }
        // Handle other cases like images, links, etc. if needed
      });
      const paragraph = new Paragraph({
        children: [...currentTextRuns],
      });
  
      documentContent.push(paragraph);
    
      // Log document structure for debugging
      console.log("Document Content:", documentContent);
    
      // Create the Document with proper structure
      const doc = new Document({
        sections: [
          {
            properties: {
              // Define page size, margins, etc. here if needed
            },
            children: documentContent,
          },
        ],
      });
    
      // Log the final document object for debugging
      console.log("Generated Document:", doc);
    
      // Generate the Word document and download it
      Packer.toBlob(doc)
        .then(blob => {
          saveAs(blob, "document.docx");
        })
        .catch(error => {
          console.error("Error generating Word document:", error);
        });
};