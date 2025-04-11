
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
    

    // Initialize socket connection
    useEffect(() => {
        const s = io("http://localhost:5000", {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ["websocket"]
        });
        setSocket(s);
        return () => s.disconnect();
    }, []);

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



    // Document export functions
    const saveDocumentAsDocx = async () => {
        if (!quill) return;
        
        try {
            const content = quill.getContents();
            const paragraphs = [];
            
            // Add title
            paragraphs.push(
                new Paragraph({
                    text: `Document from Room ${roomId}`,
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
            saveAs(blob, `document-${roomId}.docx`);
        } catch (error) {
            console.error("Error generating Word document:", error);
            alert("Failed to generate Word document. Please try again.");
        }
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
        
        const htmlContent = editor.innerHTML;
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Document from Room ${roomId}</title>
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
        saveAs(blob, `document-${roomId}.html`);
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
        <div className="flex h-screen overflow-y-auto">
            <div className="w-3/4 p-4">
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-2xl overflow-hidden mb-6">
                    <div className="sticky top-0 z-10 px-1 pt-1">
                        <div
                            className="container bg-gray-900 rounded-lg"
                            ref={useCallback((wrapper) => {
                                if (!wrapper) return;
                                wrapper.innerHTML = "";
                                const editor = document.createElement("div");
                                editor.className = "bg-gray-800 min-h-[500px] text-gray-200";
                                wrapper.append(editor);
                                const q = new Quill(editor, { 
                                    theme: "snow", 
                                    modules: MODULES 
                                });
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
                    
                    <div className="bg-gray-900 p-3 border-t border-blue-700">
                        <div className="flex justify-between items-center">
                            <div className="text-blue-300 text-sm">
                                <span className="mr-2">Room: {roomId}</span>
                                {username && <span>• User: {username}</span>}
                            </div>
                            <div className="text-blue-300 text-sm">
                                <span>Auto-saving every {SAVE_INTERVAL/1000}s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showModal && renderExportModal()}

        </div>
    );
}
