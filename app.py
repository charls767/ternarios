from flask import Flask, request, jsonify, send_file, render_template
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Usar backend sin interfaz gráfica
import matplotlib.pyplot as plt
import ternary
import re
import traceback
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas as pdf_canvas

app = Flask(__name__)

# ==========================
# Constantes de validación
# ==========================
HEX_COLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")
VALID_MARKERS = {"o", "s", "D", "^"}
VALID_LINESTYLES = {"-", "--", ":", "-."}

# =====================================================
# BE-03 / BE-04: Generador puro del diagrama ternario
# =====================================================
def generate_ternary_plot(config: dict) -> bytes:
    try:
        scale = config.get("scale", 100)
        labels = config.get("labels", {})
        points = config.get("points", [])
        lines = config.get("lines", {})

        fig, ax = plt.subplots(figsize=(11, 10))
        tax = ternary.TernaryAxesSubplot(ax=ax, scale=scale)

        tax.boundary()
        
        # Remover el marco negro (spines)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_visible(False)
        ax.spines['left'].set_visible(False)
        
        # Grilla con múltiplos de 10 para que sea divisible en porcentajes
        grid_step = max(scale // 10, 1)
        tax.gridlines(color="lightgray", multiple=grid_step, linewidth=0.8, alpha=0.6)

        # Etiquetas principales de los ejes
        left_label = labels.get("left", "A")
        right_label = labels.get("right", "B")
        bottom_label = labels.get("bottom", "C")
        
        tax.left_axis_label(left_label, fontsize=12, fontweight='bold', offset=0.15)
        tax.right_axis_label(right_label, fontsize=12, fontweight='bold', offset=0.15)
        tax.bottom_axis_label(bottom_label, fontsize=12, fontweight='bold', offset=0.15)

        # Configurar ticks con porcentajes en los ejes
        tick_positions = list(range(0, scale + 1, grid_step))
        tick_labels = [f"{int(t * 100 / scale)}%" for t in tick_positions]
        
        # Usar el método correcto de ternary para ticks
        tax.ticks(ticks=tick_positions, axis='lbr', 
                  linewidth=1, multiple=grid_step)
        
        tax.set_title("Diagrama Ternario", fontsize=14, fontweight='bold', pad=20)

        # Agrupar puntos por serie
        series_points = {}
        for p in points:
            series = p.get("series", "Sin serie")
            if series not in series_points:
                series_points[series] = []
            series_points[series].append(p)

        # Dibujar puntos y líneas por serie
        for series, series_pt_list in series_points.items():
            coordinates = []
            
            for p in series_pt_list:
                try:
                    coord = tuple(p["values"])
                    coordinates.append(coord)

                    tax.scatter(
                        [coord],
                        marker=p.get("marker", "o"),
                        color=p.get("color", "#ff0000"),
                        s=p.get("size", 60),
                        edgecolor='black',
                        linewidth=0.5,
                        zorder=5
                    )
                except Exception as point_error:
                    print(f"Error al procesar punto de serie {series}: {point_error}")
                    raise

            # Conectar puntos solo dentro de la misma serie
            if lines.get("enabled", False) and len(coordinates) > 1:
                try:
                    tax.plot(
                        coordinates,
                        color=lines.get("color", "#000000"),
                        linewidth=lines.get("width", 2),
                        linestyle=lines.get("style", "-"),
                        zorder=4
                    )
                except Exception as line_error:
                    print(f"Error al dibujar líneas de serie {series}: {line_error}")
                    raise

        tax.clear_matplotlib_ticks()

        buffer = BytesIO()
        plt.savefig(buffer, format="png", bbox_inches="tight", dpi=100)
        buffer.seek(0)
        plt.close(fig)

        return buffer.getvalue()
    except Exception as e:
        print(f"Error en generate_ternary_plot: {e}")
        raise

# ======================================
# BE-02: Validación estricta del contrato
# ======================================
def validate_config(data: dict):
    # scale
    scale_val = data.get("scale")
    if not isinstance(scale_val, (int, float)) or scale_val <= 0:
        return 400, "scale debe ser un número positivo"
    
    scale = int(scale_val)

    # labels
    labels = data.get("labels")
    if not isinstance(labels, dict):
        return 400, "labels inválidos"

    for k in ("left", "right", "bottom"):
        if k not in labels or not isinstance(labels[k], str):
            return 400, "labels inválidos"

    # points
    points = data.get("points")
    if not isinstance(points, list):
        return 400, "points inválidos"

    for p in points:
        if not isinstance(p.get("id"), str):
            return 400, "id de punto inválido"

        if not isinstance(p.get("series"), str):
            return 400, f"serie inválida en punto {p.get('id')}"

        values = p.get("values")
        if (
            not isinstance(values, list)
            or len(values) != 3
            or not all(isinstance(v, (int, float)) and v >= 0 for v in values)
        ):
            return 400, f"values inválidos en punto {p.get('id')}"

        if sum(values) != scale:
            return 422, f"El punto {p['id']} no cumple a + b + c = scale"

        if not HEX_COLOR.match(p.get("color", "")):
            return 400, f"Color inválido en punto {p['id']}"

        if not isinstance(p.get("size"), (int, float)) or p["size"] <= 0:
            return 400, f"Tamaño inválido en punto {p['id']}"

        if p.get("marker") not in VALID_MARKERS:
            return 400, f"Marcador inválido en punto {p['id']}"

    # lines
    lines = data.get("lines")
    if not isinstance(lines, dict):
        return 400, "lines inválido"

    if not isinstance(lines.get("enabled"), bool):
        return 400, "lines.enabled inválido"

    if not HEX_COLOR.match(lines.get("color", "")):
        return 400, "Color de línea inválido"

    if not isinstance(lines.get("width"), (int, float)) or lines["width"] <= 0:
        return 400, "Ancho de línea inválido"

    if lines.get("style") not in VALID_LINESTYLES:
        return 400, "Estilo de línea inválido"

    return None, None

# ==========================
# BE-01: Rutas HTTP
# ==========================
@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/docs", methods=["GET"])
def docs():
    return render_template("docs.html")

@app.route("/plot", methods=["POST"])
def plot():
    try:
        data = request.get_json(force=True)
        print("Datos recibidos:", data)
    except Exception as e:
        print("Error al parsear JSON:", str(e))
        return jsonify(error="JSON inválido"), 400

    status, error = validate_config(data)
    if error:
        print("Error de validación:", error)
        return jsonify(error=error), status

    try:
        print("Generando diagrama...")
        png_bytes = generate_ternary_plot(data)
        print("Diagrama generado exitosamente")
        return send_file(
            BytesIO(png_bytes),
            mimetype="image/png",
            as_attachment=False,
            download_name="diagram.png"
        )
    except Exception as e:
        print("Error interno al generar diagrama:")
        print(traceback.format_exc())
        error_msg = str(e)
        return jsonify(error=f"Error del servidor: {error_msg}"), 500


@app.route("/export-pdf", methods=["POST"])
def export_pdf():
    try:
        data = request.get_json(force=True)
        
        # Generar diagrama PNG
        png_bytes = generate_ternary_plot(data)
        png_image = Image.open(BytesIO(png_bytes))
        
        # Crear PDF
        pdf_buffer = BytesIO()
        page_width, page_height = A4
        
        c = pdf_canvas.Canvas(pdf_buffer, pagesize=A4)
        
        # Título
        c.setFont("Helvetica-Bold", 16)
        c.drawString(40, page_height - 40, "Diagrama Ternario")
        
        # Información del diagrama
        c.setFont("Helvetica", 10)
        y_pos = page_height - 70
        
        labels = data.get("labels", {})
        c.drawString(40, y_pos, f"Eje izquierdo (A): {labels.get('left', 'A')}")
        y_pos -= 15
        c.drawString(40, y_pos, f"Eje derecho (B): {labels.get('right', 'B')}")
        y_pos -= 15
        c.drawString(40, y_pos, f"Eje inferior (C): {labels.get('bottom', 'C')}")
        y_pos -= 20
        
        # Información de puntos
        points = data.get("points", [])
        c.drawString(40, y_pos, f"Total de puntos: {len(points)}")
        
        # Insertar imagen
        img_width = 400
        img_height = 400
        img_x = (page_width - img_width) / 2
        img_y = page_height - 500
        
        # Convertir PIL Image a bytes para reportlab
        png_temp = BytesIO()
        png_image.save(png_temp, format="PNG")
        png_temp.seek(0)
        
        c.drawImage(png_temp, img_x, img_y, width=img_width, height=img_height)
        
        # Pie de página
        c.setFont("Helvetica", 8)
        from datetime import datetime
        c.drawString(40, 20, f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        c.save()
        pdf_buffer.seek(0)
        
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="diagrama.pdf"
        )
    except Exception as e:
        print("Error al generar PDF:")
        print(traceback.format_exc())
        error_msg = str(e)
        return jsonify(error=f"Error al generar PDF: {error_msg}"), 500


if __name__ == "__main__":
    import os
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode)
