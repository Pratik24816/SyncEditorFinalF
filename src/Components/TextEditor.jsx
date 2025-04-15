import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import { io } from "socket.io-client";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType  } from "docx";
import { importAsQuill } from "../Utilities/importAsQuill";
import ImageResize from "quill-image-resize-module-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

Quill.register("modules/cursors", QuillCursors);
Quill.register("modules/imageResize", ImageResize);

const TOOLBAR_OPTIONS = [
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline",'strike'],
    [{ header: 1 }, { header: 2 },{ header: 3 },{ header: 4 }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ list: "ordered" }, { list: "bullet" },{ 'list': 'check' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
  ['clean'],
  ['emoji']
];

const MODULES = {
    toolbar: TOOLBAR_OPTIONS,
    
    cursors: {
        transformOnTextChange: true,
        hideDelayMs: 5000,
        hideSpeedMs: 400,
        selectionChangeSource: null,
        displaySelectionLabels: true,
        template: '<div class="custom-cursor"><span class="cursor-label"></span></div>',
    },
    imageResize: {
        displaySize: true,
        modules: ["Resize", "DisplaySize", "Toolbar"],
    }
};

const SAVE_INTERVAL = 2000;
export default function TextEditor({ socketRef, roomId, username }) {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState('');
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [lastSaved, setLastSaved] = useState(null)
    const [showStats, setShowStats] = useState(false);
  
     // Move the editorRef useCallback to the top level
     const editorRef = useCallback((wrapper) => {
        if (!wrapper) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        editor.className = "bg-gray-800 min-h-[calc(100vh-220px)] text-gray-200"
        wrapper.append(editor)
        
        const q = new Quill(editor, {
          theme: "snow",
          modules: MODULES,
          placeholder: "Start typing, together...",
        })
        
        q.disable()
        q.setText("Loading...")
        setQuill(q)
    }, [])
  
  
    

   
    // Initialize socket connection
  //  useEffect(() => {
       // const s = io("http://localhost:5000", {
           // reconnectionAttempts: 5,
           // reconnectionDelay: 1000,
           // transports: ["websocket"]
       // });
       // setSocket(s);
      //  return () => s.disconnect();
 //   }, []);


    //  // Initialize socket connection
      useEffect(() => {
         const s = io("https://synceditorfinalb.onrender.com", {
            reconnectionAttempts: 5,
             reconnectionDelay: 1000,
            transports: ["websocket"]
        });
        setSocket(s);
         return () => s.disconnect();
     }, []);



      // Count update effect
  useEffect(() => {
    const updateCounts = () => {
      if (!quill) return
      const text = quill.getText()
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      const chars = text.length - 1
      setWordCount(words)
      setCharCount(chars)
    }

    quill?.on("text-change", updateCounts)
    return () => quill?.off("text-change", updateCounts)
  }, [quill])

    // Load document and setup toolbar
    useEffect(() => {
        if (!socket || !quill) return;

        socket.on("load-document", (document) => {
            quill.setContents(document.data);
            quill.enable();
        });

        socket.emit("get-document", { documentId: roomId});

        const toolbar = quill.getModule("toolbar");
        if (toolbar?.container) {
            toolbar.container.classList.add("bg-gray-900", "rounded-t-lg", "border-blue-500", "border-t", "border-x","flex","jutify-center","items-center","p-2");
            
            const buttons = toolbar.container.querySelectorAll("button");
            buttons.forEach(button => {
                button.classList.add("text-gray-200", "hover:bg-blue-700", "rounded", "mx-1");
            });
            
            const selects = toolbar.container.querySelectorAll(".ql-picker");
            selects.forEach(select => {
                select.classList.add("text-gray-200");
            });

            // Add custom buttons
            const downloadButton = document.createElement("button");
            downloadButton.innerHTML = "📥";
            downloadButton.className = "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md ml-2 transition-colors duration-200";
            downloadButton.title = "Download Document";
            downloadButton.onclick = () => setShowModal(true);
            toolbar.container.appendChild(downloadButton);
        
            const importButton = document.createElement("button");
            importButton.innerHTML = "📂";
            importButton.className = "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md ml-2 transition-colors duration-200";
            importButton.title = "Import Document";
            importButton.addEventListener("click", () => importAsQuill(quill, socket));
            toolbar.container.appendChild(importButton);
        }
    }, [socket, quill, roomId]);

    // Auto-save document
    useEffect(() => {
        if (!socket || !quill) return;
        const interval = setInterval(() => {
            socket.emit("save-document", { documentId: roomId, data: quill.getContents() });
        }, SAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [socket, quill, roomId]);

    // Handle text changes and collaboration
    useEffect(() => {
        if (!socket || !quill) return;
    
        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", { documentId: roomId, userId: socket.id, username, delta });
        };
    
        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [socket, quill, username, roomId]);

    // Receive changes from other users
    useEffect(() => {
        if (!socket || !quill) return;
        const handler = ({ userId, username, delta }) => {
            if (userId === socket.id) return;
            quill.updateContents(delta);
        };
        socket.on("receive-changes", handler);
        return () => socket.off("receive-changes", handler);
    }, [socket, quill]);

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



    // Document export functions
    const saveDocumentAsDocx = async () => {
        if (!quill) return;
        
        // Create modal to ask for filename
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in";
        modal.style.animation = "fadeIn 0.3s ease-out";
        
        modal.innerHTML = `
          <div class="bg-gray-900 p-6 rounded-xl shadow-2xl w-96 border-2 border-blue-500 transform transition-all duration-300 animate-scale-in" style="animation: scaleIn 0.3s ease-out">
            <h3 class="text-white text-xl mb-6 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Save Word Document
            </h3>
            
            <div class="mb-6">
              <label class="block text-gray-300 mb-2 font-medium">File Name</label>
              <div class="relative">
                <input type="text" id="docxFileName" value="document-${roomId}" 
                  class="w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10" />
                <div class="absolute left-3 top-3 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-gray-400 text-xs mt-2">Your document will be saved with .docx extension</p>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-300 mb-2 font-medium">Document Title</label>
              <div class="relative">
                <input type="text" id="docxTitle" value="Document from Room ${roomId}" 
                  class="w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10" />
                <div class="absolute left-3 top-3 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-4">
              <button id="cancelDocxButton"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span class="mr-2">✕</span>
                Cancel
              </button>
              <button id="saveDocxButton" 
                class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                <span class="mr-2">📄</span>
                Save
              </button>
            </div>
          </div>
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out;
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Focus the input field
        const fileNameInput = modal.querySelector("#docxFileName");
        fileNameInput.focus();
        fileNameInput.select();
        
        // Add event listeners
        modal.querySelector("#saveDocxButton").addEventListener("click", async () => {
          const fileName = fileNameInput.value.trim() || `document-${roomId}`;
          const docTitle = modal.querySelector("#docxTitle").value.trim() || `Document from Room ${roomId}`;
          
          // Create loading overlay
          const loadingOverlay = document.createElement("div");
          loadingOverlay.className = "fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50";
          loadingOverlay.innerHTML = `
            <div class="relative w-24 h-24 mb-4">
              <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
              <div class="absolute inset-2 rounded-full border-4 border-transparent border-b-green-500 border-l-yellow-500 animate-spin-reverse"></div>
              <div class="absolute inset-4 flex items-center justify-center">
                <div class="text-3xl">📄</div>
              </div>
            </div>
            <h3 class="text-white text-xl font-semibold mb-2">Creating DOCX File</h3>
            <p class="text-gray-300">Please wait...</p>
          `;
          document.body.appendChild(loadingOverlay);
          
          try {
            const content = quill.getContents();
            const paragraphs = [];
            
            // Add title
            paragraphs.push(
              new Paragraph({
                text: docTitle,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              })
            );
            
            // Add author info
            if (username) {
              paragraphs.push(
                new Paragraph({
                  text: `Created by: ${username}`,
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 400 }
                })
              );
            }
            
            // Process content
            content.ops.forEach(op => {
              if (op.insert) {
                let paragraph = new Paragraph({
                  children: [
                    new TextRun({
                      text: op.insert,
                      bold: op.attributes?.bold,
                      italic: op.attributes?.italic,
                      underline: op.attributes?.underline,
                      color: op.attributes?.color,
                      size: op.attributes?.header ? 28 : 24
                    })
                  ],
                  spacing: { after: 100 }
                });
                
                if (op.attributes?.header === 1) {
                  paragraph.heading = HeadingLevel.HEADING_1;
                } else if (op.attributes?.header === 2) {
                  paragraph.heading = HeadingLevel.HEADING_2;
                }
                
                paragraphs.push(paragraph);
              }
            });
            
            const doc = new Document({
              sections: [{
                properties: {},
                children: paragraphs
              }]
            });
      
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${fileName}.docx`);
            
            // Add success feedback
            loadingOverlay.innerHTML = `
              <div class="bg-green-700 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-white text-xl font-semibold mb-2">Document Saved!</h3>
            `;
            
            setTimeout(() => {
              loadingOverlay.style.animation = "fadeOut 0.5s forwards";
              setTimeout(() => {
                loadingOverlay.remove();
              }, 500);
            }, 1000);
            
          } catch (error) {
            console.error("Error generating Word document:", error);
            loadingOverlay.innerHTML = `
              <div class="bg-red-700 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-white text-xl font-semibold mb-2">Error Saving Document</h3>
              <p class="text-gray-300 mb-4">Please try again later.</p>
              <button class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg" id="errorCloseBtn">
                Close
              </button>
            `;
            
            document.getElementById("errorCloseBtn").addEventListener("click", () => {
              loadingOverlay.style.animation = "fadeOut 0.5s forwards";
              setTimeout(() => {
                loadingOverlay.remove();
              }, 500);
            });
          }
          
          // Add animation for closing the modal
          modal.style.animation = "fadeOut 0.3s ease-in forwards";
          const modalContent = modal.querySelector('div');
          modalContent.style.animation = "scaleOut 0.3s ease-in forwards";
          
          // Add closing animations
          const closeStyle = document.createElement('style');
          closeStyle.textContent = `
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes scaleOut {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.9); opacity: 0; }
            }
          `;
          document.head.appendChild(closeStyle);
          
          setTimeout(() => {
            modal.remove();
            style.remove();
            closeStyle.remove();
          }, 300);
        });
        
        modal.querySelector("#cancelDocxButton").addEventListener("click", () => {
          // Add animation for closing
          modal.style.animation = "fadeOut 0.3s ease-in forwards";
          const modalContent = modal.querySelector('div');
          modalContent.style.animation = "scaleOut 0.3s ease-in forwards";
          
          // Add closing animations
          const closeStyle = document.createElement('style');
          closeStyle.textContent = `
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes scaleOut {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.9); opacity: 0; }
            }
          `;
          document.head.appendChild(closeStyle);
          
          setTimeout(() => {
            modal.remove();
            style.remove();
            closeStyle.remove();
          }, 300);
        });
        
        // Allow closing by clicking outside modal
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.querySelector("#cancelDocxButton").click();
          }
        });
        
        // Allow closing with Escape key
        document.addEventListener("keydown", function escHandler(e) {
          if (e.key === "Escape") {
            document.removeEventListener("keydown", escHandler);
            modal.querySelector("#cancelDocxButton").click();
          }
        });
      };

    
          const saveDocumentAsPdf = async () => {
        const quillEditor = document.querySelector(".ql-editor");
        if (!quillEditor) {
            alert("Error: Could not find the document content.");
            return;
        }
        
        // Create modal for PDF options
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";
        modal.innerHTML = `
            <div class="bg-gray-900 p-6 rounded-xl shadow-lg w-96 border border-blue-500">
                <h3 class="text-white text-xl mb-4 font-bold">PDF Export Options</h3>
                
                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">File Name</label>
                    <input type="text" id="pdfFileName" value="document-${roomId}" 
                        class="w-full p-2 bg-gray-800 border border-blue-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Page Size</label>
                    <select id="pdfPageSize" class="w-full p-2 bg-gray-800 border border-blue-500 rounded text-white">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-300 mb-2">Orientation</label>
                    <select id="pdfOrientation" class="w-full p-2 bg-gray-800 border border-blue-500 rounded text-white">
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
                
                <div class="flex justify-between mt-6">
                    <button id="savePdfButton" 
                        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Export PDF
                    </button>
                    <button id="cancelPdfButton"
                        class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const fileNameInput = modal.querySelector("#pdfFileName");
        fileNameInput.focus();
        
        modal.querySelector("#savePdfButton").addEventListener("click", async () => {
            const fileName = fileNameInput.value.trim() || `document-${roomId}`;
            const pageSize = modal.querySelector("#pdfPageSize").value;
            const orientation = modal.querySelector("#pdfOrientation").value;
            
            modal.remove();
            
            try {
                // Show loading indicator
                const loading = document.createElement("div");
                loading.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50";
                loading.innerHTML = `<div class="text-white text-xl">Generating PDF... This may take a moment for large documents.</div>`;
                document.body.appendChild(loading);
                
                // Create PDF
                const pdf = new jsPDF({
                    orientation,
                    unit: 'mm',
                    format: pageSize
                });
                
                // Calculate page dimensions
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                
                // Split content into pages
                const editorHeight = quillEditor.scrollHeight;
                const pageCount = Math.ceil(editorHeight / (pageHeight * 3.78)); // Convert mm to px
                
                for (let i = 0; i < pageCount; i++) {
                    if (i > 0) pdf.addPage();
                    
                    const canvas = await html2canvas(quillEditor, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: null,
                        windowHeight: pageHeight * 3.78,
                        y: i * pageHeight * 3.78,
                        height: pageHeight * 3.78
                    });
                    
                    const imgData = canvas.toDataURL("image/png");
                    const imgHeight = (canvas.height * pageWidth) / canvas.width;
                    
                    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
                }
                
                pdf.save(`${fileName}.pdf`);
                loading.remove();
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Failed to generate PDF. Please try again.");
            }
        });
        
        modal.querySelector("#cancelPdfButton").addEventListener("click", () => {
            modal.remove();
        });
    };

    const saveDocumentAsTxt = () => {
        if (!quill) return;
        
        const content = quill.getText();
        if (!content.trim()) {
            alert("Document is empty!");
            return;
        }
        
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `document-${roomId}.txt`);
    };
    
    
    
    const saveDocumentAsHtml = () => {
        if (!quill) return;
        
        const editor = document.querySelector(".ql-editor");
        if (!editor) return;
        
        // Create modal to ask for filename
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fade-in";
        modal.style.animation = "fadeIn 0.3s ease-out";
        
        modal.innerHTML = `
          <div class="bg-gray-900 p-6 rounded-xl shadow-2xl w-96 border-2 border-blue-500 transform transition-all duration-300 animate-scale-in" style="animation: scaleIn 0.3s ease-out">
            <h3 class="text-white text-xl mb-6 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Save HTML Document
            </h3>
            
            <div class="mb-6">
              <label class="block text-gray-300 mb-2 font-medium">File Name</label>
              <div class="relative">
                <input type="text" id="htmlFileName" value="document-${roomId}" 
                  class="w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10" />
                <div class="absolute left-3 top-3 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-gray-400 text-xs mt-2">Your document will be saved with .html extension</p>
            </div>
            
            <div class="flex space-x-4">
              <button id="cancelHtmlButton"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <span class="mr-2">✕</span>
                Cancel
              </button>
              <button id="saveHtmlButton" 
                class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                <span class="mr-2">💾</span>
                Save
              </button>
            </div>
          </div>
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out;
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Focus the input field
        const fileNameInput = modal.querySelector("#htmlFileName");
        fileNameInput.focus();
        fileNameInput.select();
        
        // Add event listeners
        modal.querySelector("#saveHtmlButton").addEventListener("click", () => {
          const fileName = fileNameInput.value.trim() || `document-${roomId}`;
          
          const htmlContent = editor.innerHTML;
          const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${fileName}</title>
                <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 2rem;
                        background-color: #f5f5f5;
                    }
                    .ql-editor {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 2rem;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <div class="ql-container ql-snow">
                    <div class="ql-editor">${htmlContent}</div>
                </div>
            </body>
            </html>
          `;
          
          const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
          saveAs(blob, `${fileName}.html`);
          
          // Add animation for closing
          modal.style.animation = "fadeOut 0.3s ease-in forwards";
          const modalContent = modal.querySelector('div');
          modalContent.style.animation = "scaleOut 0.3s ease-in forwards";
          
          // Add closing animations
          const closeStyle = document.createElement('style');
          closeStyle.textContent = `
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes scaleOut {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.9); opacity: 0; }
            }
          `;
          document.head.appendChild(closeStyle);
          
          setTimeout(() => {
            modal.remove();
            style.remove();
            closeStyle.remove();
          }, 300);
        });
        
        modal.querySelector("#cancelHtmlButton").addEventListener("click", () => {
          // Add animation for closing
          modal.style.animation = "fadeOut 0.3s ease-in forwards";
          const modalContent = modal.querySelector('div');
          modalContent.style.animation = "scaleOut 0.3s ease-in forwards";
          
          // Add closing animations
          const closeStyle = document.createElement('style');
          closeStyle.textContent = `
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes scaleOut {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.9); opacity: 0; }
            }
          `;
          document.head.appendChild(closeStyle);
          
          setTimeout(() => {
            modal.remove();
            style.remove();
            closeStyle.remove();
          }, 300);
        });
        
        // Allow closing by clicking outside modal
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.querySelector("#cancelHtmlButton").click();
          }
        });
        
        // Allow closing with Escape key
        document.addEventListener("keydown", function escHandler(e) {
          if (e.key === "Escape") {
            document.removeEventListener("keydown", escHandler);
            modal.querySelector("#cancelHtmlButton").click();
          }
        });
      };




    const renderExportModal = () => {
        const handleExport = async (exportFunction, type) => {
            setExportType(type);
            setIsExporting(true);
            try {
                await exportFunction();
            } catch (error) {
                console.error(`Error exporting ${type}:`, error);
            } finally {
                setIsExporting(false);
            }
        };



    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Main Modal */}
        <div className={`bg-gray-900 p-6 rounded-xl shadow-lg w-96 border-2 border-blue-500 transform transition-all duration-300 ${isExporting ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
            <h2 className="text-white text-2xl mb-6 font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Export Document
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                    className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-3 px-4 rounded-lg flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    onClick={() => handleExport(saveDocumentAsDocx, 'docx')}
                    disabled={isExporting}
                >
                    <span className="text-2xl mb-1">📄</span>
                    <span>Word (DOCX)</span>
                    <span className="text-xs opacity-70 mt-1">Formatted document</span>
                </button>
                
                <button 
                    className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-3 px-4 rounded-lg flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    onClick={() => handleExport(saveDocumentAsPdf, 'pdf')}
                    disabled={isExporting}
                >
                    <span className="text-2xl mb-1">📑</span>
                    <span>PDF</span>
                    <span className="text-xs opacity-70 mt-1">Multi-page ready</span>
                </button>
                
                <button 
                    className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white py-3 px-4 rounded-lg flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    onClick={() => handleExport(saveDocumentAsTxt, 'txt')}
                    disabled={isExporting}
                >
                    <span className="text-2xl mb-1">📝</span>
                    <span>Plain Text</span>
                    <span className="text-xs opacity-70 mt-1">Simple text only</span>
                </button>
                
                <button 
                    className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    onClick={() => handleExport(saveDocumentAsHtml, 'html')}
                    disabled={isExporting}
                >
                    <span className="text-2xl mb-1">🌐</span>
                    <span>HTML</span>
                    <span className="text-xs opacity-70 mt-1">Web format</span>
                </button>
            </div>
            
            <button 
                className="mt-6 text-gray-300 hover:text-white transition-colors duration-200 w-full py-2 font-medium flex items-center justify-center group"
                onClick={() => setShowModal(false)}
                disabled={isExporting}
            >
                <span className="group-hover:scale-110 transition-transform duration-200">✕</span>
                <span className="ml-2">Cancel</span>
            </button>
        </div>

        {/* Loading Animation (Canva-style) */}
        {isExporting && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        {/* Canva-style loading animation */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-green-500 border-l-yellow-500 animate-spin-reverse"></div>
                        <div className="absolute inset-4 flex items-center justify-center">
                            <div className="text-3xl">
                                {exportType === 'docx' && '📄'}
                                {exportType === 'pdf' && '📑'}
                                {exportType === 'txt' && '📝'}
                                {exportType === 'html' && '🌐'}
                            </div>
                        </div>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Exporting {exportType.toUpperCase()}</h3>
                    <p className="text-gray-300">Your document is being prepared...</p>
                    <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
    };




    return (
       <div className="flex flex-col min-h-96 mb-0">
          {/* Editor Container */} 
          <div className="bg-gradient-to-r bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg shadow-2xl overflow-hidden mb-6 flex-1 flex flex-col">
            {/* Centered Toolbar */}


            
            <div className="sticky top-0 z-10 px-1 pt-1 bg-gray-900 border-b border-indigo-700">
              <div className="max-w-4xl mx-auto px-4 py-2 flex justify-center items-center">
              </div>
            </div>
      
            {/* Centered Scrollable Editor Area */}
            <div className="flex-1 overflow-y-auto">    
              <div className="container mx-auto max-w-4xl px-4">
                <div className="bg-gray-900 rounded-lg min-h-[70vh]">
                  <div
                    className="bg-gray-800 text-gray-200 mx-auto"
                    ref={useCallback((wrapper) => {
                      // ... existing editor setup
                      if (!wrapper) return;
                      wrapper.innerHTML = "";
                      const editor = document.createElement("div");
                      editor.className = "h-full";
                      wrapper.append(editor);
                      
                      const q = new Quill(editor, { 
                        theme: "snow", 
                        modules: MODULES 
                      });
                      
                      // Keep existing editor setup
                      q.disable();
                      q.setText("Loading...");
                      
                      const editorContainer = editor.querySelector(".ql-container");
                      if (editorContainer) {
                          editorContainer.classList.add("border-blue-500", "border-b", "border-x", "rounded-b-lg");
                      }
                      
                      const editorContent = editor.querySelector(".ql-editor");
                      if (editorContent) {
                          editorContent.classList.add("min-h-[450px]", "text-gray-200");
                      }
                      
                      setQuill(q);
                    }, [])}
                  />
                </div>
              </div>
            </div>
      
            <div className="sticky bottom-0 bg-gray-900 border-t border-indigo-700">
  <div className="max-w-4xl mx-auto px-4 py-3">
    <div className="flex justify-between items-center">

      {/* Toggle Button */}
      <button
        className="text-indigo-300 text-sm bg-gray-800 px-3 py-1 rounded-md hover:text-white transition duration-200"
        onClick={() => setShowStats(!showStats)}
      >
        {showStats ? "Hide Stats 📉" : "Show Stats 📊"}
      </button>

      {/* Word & Char Count (Toggleable) */}
      {showStats && (
        <div className="text-indigo-300 text-sm flex items-center space-x-4">
          <span className="inline-flex items-center mr-4 bg-gray-800 px-3 py-1 rounded-md">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{wordCount} words</span>
          </span>

          <span className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{charCount} characters</span>
          </span>
        </div>
      )}

      {/* Save Status */}
      <div className="text-indigo-300 text-sm flex items-center">
        {lastSaved && (
          <span className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-md">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>
              {lastSaved ? `Last saved ${Math.floor((new Date() - lastSaved) / 1000)}s ago` : "Auto-saving..."}
            </span>
          </span>
        )}
      </div>
    </div>
  </div>
</div>

          </div>
      
          {showModal && renderExportModal()}
        </div>
      )
    }
    
