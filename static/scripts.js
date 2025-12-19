// ===============================
// FE-01: Estado único
// ===============================
const diagramState = {
    scale: 100,
    labels: { left: "A", right: "B", bottom: "C" },
    series: ["Serie 1"],  // Series disponibles
    currentSeries: "Serie 1",  // Serie actual
    points: [],
    lines: {
        enabled: false,
        color: "#000000",
        width: 2,
        style: "-"
    }
};

// Colores predeterminados para series
const seriesColors = {
    "Serie 1": "#ff0000",
    "Serie 2": "#0000ff",
    "Serie 3": "#00aa00",
    "Serie 4": "#ff8800",
    "Serie 5": "#ff00ff",
    "Serie 6": "#00ffff",
    "Serie 7": "#ffaa00",
    "Serie 8": "#aa00ff"
};

function getSeriesColor(seriesName) {
    if (seriesColors[seriesName]) {
        return seriesColors[seriesName];
    }
    // Generar color aleatorio para nuevas series
    const colors = Object.values(seriesColors).filter(c => !Object.values(seriesColors).includes(c));
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 50%)`;
}

// ===============================
// Utilidades UI
// ===============================
const $ = id => document.getElementById(id);

// ===============================
// FE-02: Captura de entradas
// ===============================

// Manejar nueva serie
$("add-series").addEventListener("click", () => {
    const newSeriesName = $("new-series-name").value.trim();
    if (!newSeriesName) {
        alert("Por favor ingresa un nombre para la serie");
        return;
    }
    
    if (diagramState.series.includes(newSeriesName)) {
        alert("Esta serie ya existe");
        return;
    }
    
    diagramState.series.push(newSeriesName);
    updateSeriesSelector();
    $("new-series-name").value = "";
    diagramState.currentSeries = newSeriesName;
    $("current-series").value = newSeriesName;
});

// Actualizar selector de series
function updateSeriesSelector() {
    const select = $("current-series");
    const currentValue = select.value;
    select.innerHTML = "";
    
    diagramState.series.forEach(series => {
        const option = document.createElement("option");
        option.value = series;
        option.textContent = series;
        select.appendChild(option);
    });
    
    if (diagramState.series.includes(currentValue)) {
        select.value = currentValue;
    }
}

$("current-series").addEventListener("change", (e) => {
    diagramState.currentSeries = e.target.value;
    updatePointsTable();
});

function updatePointsTable() {
    const tbody = document.querySelector("#points-table tbody");
    const noMsg = $("no-points-msg");
    
    tbody.innerHTML = "";
    
    if (diagramState.points.length === 0) {
        noMsg.style.display = "block";
        return;
    }
    
    noMsg.style.display = "none";
    
    diagramState.points.forEach((point, idx) => {
        const row = document.createElement("tr");
        const seriesColor = getSeriesColor(point.series);
        
        row.innerHTML = `
            <td>${point.id}</td>
            <td><strong>${point.series}</strong></td>
            <td>${point.values[0]}</td>
            <td>${point.values[1]}</td>
            <td>${point.values[2]}</td>
            <td><div class="color-swatch" style="background-color: ${seriesColor}"></div></td>
            <td><button class="btn-delete" data-index="${idx}">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });
    
    // Event listeners para eliminar
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.dataset.index);
            diagramState.points.splice(idx, 1);
            updatePointsTable();
            updateDiagram();
        });
    });
}

$("add-point").addEventListener("click", () => {
    const a = Number($("val-a").value);
    const b = Number($("val-b").value);
    const c = Number($("val-c").value);
    const scale = diagramState.scale;

    const warning = $("point-warning");
    warning.textContent = "";

    if ([a, b, c].some(v => isNaN(v))) {
        warning.textContent = "Todos los valores deben ser numéricos";
        return;
    }

    if (a + b + c !== scale) {
        warning.textContent = "A + B + C debe ser igual a la escala";
        return;
    }

    diagramState.points.push({
        id: `P${diagramState.points.length + 1}`,
        series: diagramState.currentSeries,
        values: [a, b, c],
        color: $("point-color").value,
        size: Number($("point-size").value),
        marker: $("point-marker").value
    });

    warning.textContent = "Punto añadido";
    updatePointsTable();
    updateDiagram();
    
    // Limpiar campos
    $("val-a").value = "";
    $("val-b").value = "";
    $("val-c").value = "";
});

// Configuración general
$("scale").addEventListener("change", e => diagramState.scale = Number(e.target.value));
$("label-left").addEventListener("input", e => diagramState.labels.left = e.target.value);
$("label-right").addEventListener("input", e => diagramState.labels.right = e.target.value);
$("label-bottom").addEventListener("input", e => diagramState.labels.bottom = e.target.value);

// Líneas
$("lines-enabled").addEventListener("change", e => {
    diagramState.lines.enabled = e.target.checked;
});
$("line-color").addEventListener("input", e => diagramState.lines.color = e.target.value);
$("line-width").addEventListener("change", e => diagramState.lines.width = Number(e.target.value));
$("line-style").addEventListener("change", e => diagramState.lines.style = e.target.value);

// ===============================
// FE-04 / FE-05
// ===============================
async function updateDiagram() {
    const spinner = $("spinner");
    const errorDiv = $("error");
    const resultImg = $("result");

    if (!spinner || !errorDiv || !resultImg) {
        console.error("Error: Elementos del DOM no encontrados");
        return;
    }

    spinner.style.display = "block";
    if (resultImg.src) {
        URL.revokeObjectURL(resultImg.src);
    }
    resultImg.src = "";

    try {
        console.log("📊 Enviando diagrama con estado:", diagramState);
        
        const res = await fetch("/plot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(diagramState)
        });

        console.log("✅ Respuesta recibida:", res.status, res.statusText);

        if (!res.ok) {
            const text = await res.text();
            console.error("❌ Error en respuesta:", text);
            let errorMessage;
            try {
                const err = JSON.parse(text);
                errorMessage = err.error;
            } catch {
                errorMessage = text || "Error desconocido en el servidor";
            }
            throw new Error(errorMessage);
        }

        if (!res.headers.get("content-type")?.includes("image")) {
            throw new Error("Respuesta no es una imagen válida");
        }

        const blob = await res.blob();
        console.log("📦 Blob recibido, tamaño:", blob.size, "bytes");
        
        if (blob.size === 0) {
            throw new Error("Imagen vacía recibida");
        }

        const objectUrl = URL.createObjectURL(blob);
        console.log("🔗 Object URL creado:", objectUrl);
        
        // Limpiar errores antes de intentar cargar la imagen
        errorDiv.textContent = "";
        
        // Crear un handler de error antes de asignar src
        const handleError = () => {
            console.error("❌ Error al cargar la imagen en el img tag");
            errorDiv.textContent = "Error: No se puede cargar la imagen";
            URL.revokeObjectURL(objectUrl);
        };
        
        resultImg.onerror = handleError;
        resultImg.onload = () => {
            // Si carga exitosamente, remover el handler de error y limpiar mensaje de error
            console.log("✅ Imagen cargada exitosamente");
            resultImg.onerror = null;
            errorDiv.textContent = "";
            spinner.style.display = "none";
        };
        resultImg.src = objectUrl;

    } catch (e) {
        console.error("❌ Error al actualizar diagrama:", e);
        errorDiv.textContent = "Error: " + e.message;
    } finally {
        spinner.style.display = "none";
    }
}

// Asegurar que DOM esté listo antes de agregar listeners
document.addEventListener("DOMContentLoaded", () => {
    const updateBtn = $("update");
    if (updateBtn) {
        updateBtn.addEventListener("click", updateDiagram);
    }
    
    // Generar diagrama vacío al cargar la página
    updateDiagram();
});

// ===============================
// Limpiar
// ===============================
$("clear").addEventListener("click", () => {
    diagramState.points = [];
    $("result").src = "";
    updatePointsTable();
    updateDiagram();
});

// ===============================
// Descargas
// ===============================
function downloadDiagram(format) {
    const img = $("result");
    
    if (!img.src) {
        alert("No hay diagrama para descargar");
        return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.onload = () => {
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        ctx.drawImage(tempImg, 0, 0);
        
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `diagrama-ternario-${timestamp}`;
        
        if (format === "png") {
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${filename}.png`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, "image/png");
        } 
        else if (format === "jpg") {
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${filename}.jpg`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, "image/jpeg", 0.95);
        }
        else if (format === "pdf") {
            // Enviar al servidor para generar PDF
            fetch("/export-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(diagramState)
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al generar PDF");
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${filename}.pdf`;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(err => alert("Error: " + err.message));
        }
    };
    tempImg.onerror = () => alert("Error al cargar la imagen");
    tempImg.src = img.src;
}

$("download-png").addEventListener("click", () => downloadDiagram("png"));
$("download-jpg").addEventListener("click", () => downloadDiagram("jpg"));
$("download-pdf").addEventListener("click", () => downloadDiagram("pdf"));

// ===============================
// Theme Toggle (Dark/Light Mode)
// ===============================
function initTheme() {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        $("theme-toggle").textContent = "☀️";
    } else {
        document.documentElement.classList.remove("dark-mode");
        $("theme-toggle").textContent = "🌙";
    }
}

$("theme-toggle").addEventListener("click", () => {
    const isDarkMode = document.documentElement.classList.contains("dark-mode");
    
    if (isDarkMode) {
        document.documentElement.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        $("theme-toggle").textContent = "🌙";
    } else {
        document.documentElement.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        $("theme-toggle").textContent = "☀️";
    }
});

// Inicializar tema al cargar la página
initTheme();
