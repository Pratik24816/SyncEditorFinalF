import Mammoth from "mammoth";

export const importAsQuill=(quill,socket)=>{
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".docx";
    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file || quill == null)
            return;
  
        const reader = new FileReader();
        reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
  
        try {
          const { value: wordContent } = await Mammoth.convertToHtml({ arrayBuffer });
  
          quill.clipboard.dangerouslyPasteHTML(wordContent);
  
          const delta = quill.getContents();
  
          if (socket) {
            socket.emit("file-imported", delta);
          }
        } catch (error) {
          console.error("Error importing Word file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    };
    fileInput.click();
}
