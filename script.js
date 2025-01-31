document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const tools = document.querySelectorAll(".tool");
    const fillColor = document.querySelector(".fill-color");
    const brushSize = document.querySelector("input[type='range']");
    const colorPicker = document.querySelector("input[type='color']");
    const clearCanvasBtn = document.querySelector("button:nth-of-type(1)");
    const saveImageBtn = document.querySelector("button:nth-of-type(2)");

    let isDrawing = false;
    let prevX, prevY;
    let brushWidth = 5;
    let selectedColor = "#000";
    let selectedTool = "";
    let snapshot;


    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const startDrawing = (e) => {
        isDrawing = true;
        prevX = e.offsetX;
        prevY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        ctx.moveTo(prevX, prevY);
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

   
    const drawing = (e) => {
        if (!isDrawing) return;

        ctx.putImageData(snapshot, 0, 0); 

        if (selectedTool === "Brush") {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (selectedTool === "Eraser") {
            ctx.strokeStyle = "#fff"; 
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (selectedTool === "Rectangle") {
            const width = e.offsetX - prevX;
            const height = e.offsetY - prevY;
            if (fillColor.checked) {
                ctx.fillRect(prevX, prevY, width, height);
            } else {
                ctx.strokeRect(prevX, prevY, width, height);
            }
        } else if (selectedTool === "Circle") {
            const radius = Math.sqrt(Math.pow(e.offsetX - prevX, 2) + Math.pow(e.offsetY - prevY, 2));
            ctx.beginPath();
            ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
            fillColor.checked ? ctx.fill() : ctx.stroke();

        } else if (selectedTool === "Triangle") {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY);
            ctx.closePath();
            fillColor.checked ? ctx.fill() : ctx.stroke();
        }
    };

    const stopDrawing = () => {
        isDrawing = false;
    };


    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveCanvas = () => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "drawing.png";
        link.click();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", stopDrawing);

    tools.forEach(tool => {
        tool.addEventListener("click", () => {
            selectedTool = tool.id;
        });
    });

    brushSize.addEventListener("input", (e) => {
        brushWidth = e.target.value;
    });

    colorPicker.addEventListener("input", (e) => {
        selectedColor = e.target.value;
    });

    clearCanvasBtn.addEventListener("click", clearCanvas);
    saveImageBtn.addEventListener("click", saveCanvas);
});
