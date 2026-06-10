# Principios Generales de Diseño

## KISS — Keep It Simple, Stupid

El código más simple que funcione correctamente es siempre el mejor.

```python
# ❌ Sobrecomplejo
def obtener_saludo(nombre: str, hora: int) -> str:
    periodos = {
        range(0, 6): "madrugada",
        range(6, 12): "mañana",
        range(12, 18): "tarde",
        range(18, 24): "noche",
    }
    periodo = next((v for k, v in periodos.items() if hora in k), "día")
    return f"{'Buenos días' if periodo == 'mañana' else 'Buenas ' + periodo}, {nombre.strip().title()}!"

# ✅ Simple y claro
def obtener_saludo(nombre: str, hora: int) -> str:
    if 6 <= hora < 12:
        saludo = "Buenos días"
    elif 12 <= hora < 18:
        saludo = "Buenas tardes"
    else:
        saludo = "Buenas noches"
    return f"{saludo}, {nombre}!"
```

**Señales de alerta:**
- Funciones de más de 20 líneas
- Condiciones anidadas de 3+ niveles
- Usar patrones de diseño "porque son bonitos", no porque resuelvan un problema real

---

## DRY — Don't Repeat Yourself

Cada pieza de conocimiento debe tener una única representación en el sistema.

```python
# ❌ Repetición — si cambia el formato del error, hay que tocar 3 sitios
@app.get("/usuarios/{id}")
def get_usuario(id: int):
    usuario = db.get(id)
    if not usuario:
        raise HTTPException(status_code=404, detail=f"Usuario {id} no encontrado")
    return usuario

@app.delete("/usuarios/{id}")
def delete_usuario(id: int):
    usuario = db.get(id)
    if not usuario:
        raise HTTPException(status_code=404, detail=f"Usuario {id} no encontrado")
    db.delete(id)

@app.put("/usuarios/{id}")
def update_usuario(id: int, datos: UsuarioUpdate):
    usuario = db.get(id)
    if not usuario:
        raise HTTPException(status_code=404, detail=f"Usuario {id} no encontrado")
    return db.update(id, datos)

# ✅ DRY — la lógica de "no encontrado" vive en un solo lugar
def get_usuario_o_404(id: int) -> Usuario:
    usuario = db.get(id)
    if not usuario:
        raise HTTPException(status_code=404, detail=f"Usuario {id} no encontrado")
    return usuario

@app.get("/usuarios/{id}")
def get_usuario(id: int):
    return get_usuario_o_404(id)

@app.delete("/usuarios/{id}")
def delete_usuario(id: int):
    get_usuario_o_404(id)
    db.delete(id)
```

**Ojo:** DRY no significa "no escribas código similar". Si el código es similar por coincidencia pero representa conceptos distintos, la abstracción forzada lo empeora. Abstrae solo cuando haya **duplicación de conocimiento**, no de forma.

---

## YAGNI — You Aren't Gonna Need It

No implementes funcionalidad que no se necesita ahora.

```python
# ❌ Diseñado para un futuro imaginario
class ServicioEmail:
    def __init__(self, proveedor="smtp", formato="html", retry_max=3,
                 queue_backend="redis", rate_limit=100, template_engine="jinja2"):
        # configuración de algo que nunca se va a usar
        pass

    def enviar(self, destino, asunto, cuerpo):
        pass

    def enviar_en_lote(self, destinatarios):  # nadie lo pidió
        pass

    def programar_envio(self, destino, asunto, cuerpo, cuando):  # nadie lo pidió
        pass

# ✅ Lo que se necesita hoy
class ServicioEmail:
    def __init__(self, smtp_host: str, smtp_port: int, usuario: str, password: str):
        self.config = (smtp_host, smtp_port, usuario, password)

    def enviar(self, destino: str, asunto: str, cuerpo: str) -> bool:
        # implementar cuando se necesite
        pass
```

---

## SoC — Separation of Concerns

Cada módulo o función debe ocuparse de **una sola preocupación**.

```python
# ❌ Una función hace demasiadas cosas
def procesar_pedido(pedido_id: int):
    # 1. Consultar BD
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pedidos WHERE id = %s", (pedido_id,))
    pedido = cursor.fetchone()

    # 2. Lógica de negocio
    if pedido["stock"] < pedido["cantidad"]:
        raise ValueError("Stock insuficiente")
    total = pedido["precio"] * pedido["cantidad"] * (1 - pedido["descuento"])

    # 3. Enviar email
    import smtplib
    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.sendmail("tienda@example.com", pedido["email"], f"Pedido {pedido_id} confirmado")

    # 4. Formatear respuesta
    return {"id": pedido_id, "total": total, "estado": "confirmado"}

# ✅ Cada responsabilidad en su capa
def procesar_pedido(pedido_id: int):
    pedido = repo_pedidos.obtener(pedido_id)          # capa de datos
    total = calcular_total(pedido)                     # lógica de negocio
    email_service.enviar_confirmacion(pedido, total)   # notificación
    return PedidoResponse(id=pedido_id, total=total)   # presentación
```

---

## LoD — Ley de Demeter (Principio del mínimo conocimiento)

Un objeto solo debe hablar con sus **vecinos directos**, no con los objetos de sus objetos.

```python
# ❌ Viola LoD — hay que conocer la estructura interna de todo
def aplicar_descuento(pedido):
    if pedido.cliente.membresia.nivel == "oro":
        pedido.total *= 0.9

# ✅ El pedido sabe cómo aplicar su propio descuento
def aplicar_descuento(pedido):
    if pedido.cliente_es_oro():
        pedido.aplicar_descuento(0.1)
```

La LoD dice: "habla con tus amigos, no con los amigos de tus amigos."
