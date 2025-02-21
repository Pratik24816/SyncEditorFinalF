import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { importAsQuill } from "../Utilities/importAsQuill"; // Import logic
import { exportToWord } from "../Utilities/exportToWord"; // Import logic
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ImageResize from "quill-image-resize-module-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
Quill.register("modules/imageResize", ImageResize); 
pdfMake.vfs = pdfFonts?.pdfMake?.vfs || {};



const TOOLBAR_OPTIONS = [
    [{ font: [] }], [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline"], [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }], [{ align: [] }], 
    ["image"],
    ["clean"]
];
const MODULES = {
    toolbar: TOOLBAR_OPTIONS,
    imageResize: {
        displaySize: true, // Show the size while resizing
        modules: ["Resize", "DisplaySize", "Toolbar"], // Enable resizing controls

        clipboard: {
            matchVisual: false, // Ensure pasted images don't break formatting
        }
    }
}
const SAVE_INTERVAL = 2000;

export default function TextEditor({ socketRef, roomId, username }) {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showNameModal, setShowNameModal] = useState(false);

    useEffect(() => {
        const s = io("https://synceditorbec.onrender.com");
        setSocket(s);
        return () => s.disconnect();
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;

        socket.on("load-document", (document) => {
            quill.setContents(document.data);
            quill.enable();
        });

        socket.emit("get-document", { documentId: roomId });
        const toolbar = quill.getModule("toolbar");

          // Create and append the download button inside the toolbar
          const downloadButton = document.createElement("button");
          downloadButton.innerHTML = "📥"; // Download icon
          downloadButton.className = "bg-blue-600 text-white px-3 py-2 rounded-md ml-2";
          downloadButton.onclick = () => setShowModal(true);
          toolbar.container.appendChild(downloadButton);

        // const saveButton = document.createElement("button");
        // saveButton.innerHTML = "💾";
        // saveButton.addEventListener("click", () => exportToWord(quill));
        // toolbar.container.appendChild(saveButton);
    
        const importButton = document.createElement("button");
        importButton.innerHTML = "📂";
        importButton.addEventListener("click", () => importAsQuill(quill,socket));
        toolbar.container.appendChild(importButton);
    }, [socket, quill, roomId]);

    useEffect(() => {
        if (!socket || !quill) return;
        const interval = setInterval(() => {
            socket.emit("save-document", { documentId: roomId, data: quill.getContents() });
        }, SAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [socket, quill]);

    useEffect(() => {
        if (!socket || !quill) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", { documentId: roomId, userId: socket.id, username, delta });
        };

        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [socket, quill, username]);

    useEffect(() => {
        if (!socket || !quill) return;
        const handler = ({ userId, username, delta }) => {
            quill.updateContents(delta);
        };
        socket.on("receive-changes", handler);
        return () => socket.off("receive-changes", handler);
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;
      
        // Listen for imported file changes
        const handleFileImported = (delta) => {
          quill.setContents(delta);
        };
      
        socket.on("receive-file", handleFileImported);
      
        return () => {
          socket.off("receive-file", handleFileImported);
        };
      }, [socket, quill]);

      
    useEffect(() => {
        if (!socket || !quill) return;
        
        // Listen for imported file changes
        const handleFileImported = (delta) => {
            quill.setContents(delta);
        };
    
        socket.on("receive-file", handleFileImported);
    
        return () => {
            socket.off("receive-file", handleFileImported);
        };
    }, [socket, quill]);

    const saveDocumentAsDocx = async () => {
        if (!quill) return;
        const text = quill.getText().trim();

        if (!text) {
            alert("Document is empty!");
            return;
        }
        
        const doc = new Document({
            sections: [
                {
                    children: text.split("\n").map((line) => new Paragraph(line))
                }
            ]
        });

        try {
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "document.docx");
        } catch (error) {
            console.error("Error generating Word document:", error);
        }



    };
    
    const saveDocumentAsPdf = async () => {
        const quillEditor = document.querySelector(".ql-editor"); // Get Quill editor content
    
        if (!quillEditor) {
            alert("Error: Could not find the document content.");
            return;
        }
    
        // Create a custom modal for file naming
        const modal = document.createElement("div");
        modal.className = "pdf-modal-overlay";
        modal.innerHTML = `
            <div class="pdf-modal">
                <h3>Save PDF</h3>
                <p>Enter a name for your PDF file:</p>
                <input type="text" id="pdfFileName" placeholder="document" />
                <div class="modal-buttons">
                    <button id="savePdfButton">Save</button>
                    <button id="cancelPdfButton">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    
        // Focus on the input field
        const fileNameInput = modal.querySelector("#pdfFileName");
        fileNameInput.focus();
    
        // Handle Save button click
        modal.querySelector("#savePdfButton").addEventListener("click", () => {
            const fileName = fileNameInput.value.trim() || "document"; // Default to "document" if empty
            modal.remove(); // Remove the modal
    
            // Generate PDF
            html2canvas(quillEditor, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size
    
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
    
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                pdf.save(`${fileName}.pdf`); // Save with user-defined name
            });
        });
    
        // Handle Cancel button click
        modal.querySelector("#cancelPdfButton").addEventListener("click", () => {
            modal.remove(); // Remove the modal
        });
    };
    return (
        <div>
            <div
                className="container"
                ref={useCallback((wrapper) => {
                    if (!wrapper) return;
                    wrapper.innerHTML = "";
                    const editor = document.createElement("div");
                    wrapper.append(editor);
                    const q = new Quill(editor, { theme: "snow", modules: MODULES });
                    q.disable();
                    q.setText("Loading...");
                    setQuill(q);

                  
                }, [])}

               
            />
             
             {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center w-80">
                            <h2 className="text-white text-xl mb-4">Download as:</h2>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mb-2" onClick={saveDocumentAsDocx}>
                                Word (DOCX)
                            </button>
                            <button className="bg-green-500 text-white py-2 px-4 rounded-md w-full" onClick={saveDocumentAsPdf}>
                                PDF
                            </button>
                            <button className="mt-4 text-gray-400" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
        </div>
    );
}
