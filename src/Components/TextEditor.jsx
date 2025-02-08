import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { importAsQuill } from "../Utilities/importAsQuill"; // Import logic

const TOOLBAR_OPTIONS = [
    [{ font: [] }], [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline"], [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }], [{ align: [] }], ["clean"]
];

const SAVE_INTERVAL = 2000;

export default function TextEditor({ socketRef, roomId, username }) {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    useEffect(() => {
        const s = io("http://localhost:5000");
        setSocket(s);
        return () => s.disconnect();
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;

        socket.once("load-document", (document) => {
            quill.setContents(document.data);
            quill.enable();
        });

        socket.emit("get-document", { documentId: roomId });
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

    return (
        <div>
            <div
                className="container"
                ref={useCallback((wrapper) => {
                    if (!wrapper) return;
                    wrapper.innerHTML = "";
                    const editor = document.createElement("div");
                    wrapper.append(editor);
                    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
                    q.disable();
                    q.setText("Loading...");
                    setQuill(q);

                    const toolbar = q.getModule("toolbar");

                    const saveButton = document.createElement("button");
                    saveButton.innerHTML = "💾";
                    saveButton.style.marginLeft = "10px";
                    saveButton.addEventListener("click", saveDocumentAsDocx);
                    toolbar.container.appendChild(saveButton);

                    const importButton = document.createElement("button");
                    importButton.innerHTML = "📂";
                    importButton.style.marginLeft = "10px";
                    importButton.addEventListener("click", () => importAsQuill(q, socket));
                    toolbar.container.appendChild(importButton);
                }, [])}
            />
        </div>
    );
}
