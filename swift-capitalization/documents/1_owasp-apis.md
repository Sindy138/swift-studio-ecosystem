# OWASP API Security Top 10 (2023)

OWASP (Open Web Application Security Project) publica periódicamente las vulnerabilidades más críticas en APIs. La edición de 2023 define estas 10 categorías:

---

## API1: Broken Object Level Authorization (BOLA)

La vulnerabilidad más común. Ocurre cuando la API no verifica que el usuario tiene permiso para acceder al objeto concreto que solicita.

```python
# MAL — verifica solo que el usuario está autenticado, no que el objeto le pertenece
@app.get("/api/pedidos/{pedido_id}")
def obtener_pedido(pedido_id: int, usuario_actual = Depends(obtener_usuario_actual)):
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    return pedido  # cualquier usuario autenticado puede ver cualquier pedido

# BIEN — verifica que el pedido pertenece al usuario que hace la petición
@app.get("/api/pedidos/{pedido_id}")
def obtener_pedido(pedido_id: int, usuario_actual = Depends(obtener_usuario_actual)):
    pedido = db.query(Pedido).filter(
        Pedido.id == pedido_id,
        Pedido.usuario_id == usuario_actual.id   # verificar propiedad
    ).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido
```

**Impacto:** Un atacante puede acceder o modificar datos de otros usuarios cambiando el ID en la URL.

---

## API2: Broken Authentication

Implementaciones de autenticación débiles o incorrectas.

```python
# MAL — token que nunca expira
def crear_token(user_id: int) -> str:
    payload = {"sub": str(user_id)}   # sin "exp" → el token es válido para siempre
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# BIEN — token con expiración corta
from datetime import datetime, timedelta

def crear_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(minutes=30),  # expira en 30 minutos
        "iat": datetime.utcnow()   # fecha de emisión
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

**Otros problemas comunes:** contraseñas débiles sin política, tokens en URLs (aparecen en logs), no invalidar tokens al hacer logout.

---

## API3: Broken Object Property Level Authorization

Exponer propiedades que el usuario no debería poder ver o modificar.

```python
# MAL — devolver todo el objeto usuario (incluye campos sensibles)
@app.get("/api/usuarios/{user_id}")
def obtener_usuario(user_id: int):
    usuario = db.query(Usuario).get(user_id)
    return usuario  # devuelve password_hash, is_admin, internal_notes, etc.

# BIEN — usar un schema de respuesta que solo expone campos públicos
class UsuarioPublico(BaseModel):
    id: int
    nombre: str
    email: str
    # NO incluir: password_hash, is_admin, created_at interno, etc.

@app.get("/api/usuarios/{user_id}", response_model=UsuarioPublico)
def obtener_usuario(user_id: int):
    usuario = db.query(Usuario).get(user_id)
    return usuario
```

---

## API4: Unrestricted Resource Consumption

Sin límites en el número de peticiones, tamaño del payload o recursos consumidos.

```python
# MAL — sin ningún límite
@app.post("/api/procesar")
async def procesar(datos: dict):
    return {"resultado": "procesado"}

# BIEN — con rate limiting y límite de tamaño de payload
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/procesar")
@limiter.limit("10/minute")   # máximo 10 peticiones por minuto por IP
async def procesar(request: Request, datos: dict):
    return {"resultado": "procesado"}
```

**En sistemas de IA:** sin límites en llamadas al LLM → un atacante puede generar facturas enormes con un bucle simple.

---

## API5: Broken Function Level Authorization

Funciones administrativas accesibles sin los permisos adecuados.

```python
# MAL — endpoint admin sin verificación de rol
@app.delete("/api/admin/usuarios/{user_id}")
def eliminar_usuario(user_id: int, usuario_actual = Depends(obtener_usuario_actual)):
    # Cualquier usuario autenticado puede eliminar a otros usuarios
    db.query(Usuario).filter(Usuario.id == user_id).delete()

# BIEN — verificar que el usuario tiene rol de administrador
def requiere_admin(usuario_actual = Depends(obtener_usuario_actual)):
    if not usuario_actual.es_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    return usuario_actual

@app.delete("/api/admin/usuarios/{user_id}")
def eliminar_usuario(user_id: int, admin = Depends(requiere_admin)):
    db.query(Usuario).filter(Usuario.id == user_id).delete()
```

---

## API6: Unrestricted Access to Sensitive Business Flows

Flujos de negocio que no deberían ser automatizables siendo explotados mediante bots.

**Ejemplos:** comprar todas las entradas de un evento, registrar miles de cuentas falsas, extraer todos los precios de un catálogo.

**Mitigación:** CAPTCHAs en flujos críticos, límites por usuario (no solo por IP), detección de comportamiento automatizado.

---

## API7: Server Side Request Forgery (SSRF)

La API hace una petición HTTP a una URL controlada por el atacante, lo que permite acceder a servicios internos.

```python
# MAL — la API hace fetch a una URL proporcionada por el usuario
@app.get("/api/preview")
async def preview(url: str):
    async with httpx.AsyncClient() as cliente:
        respuesta = await cliente.get(url)   # el atacante puede pasar http://localhost/admin
    return {"contenido": respuesta.text}

# BIEN — validar que la URL es externa y está en una allowlist
import re

DOMINIOS_PERMITIDOS = ["example.com", "openai.com", "api.anthropic.com"]

@app.get("/api/preview")
async def preview(url: str):
    from urllib.parse import urlparse
    dominio = urlparse(url).netloc
    if dominio not in DOMINIOS_PERMITIDOS:
        raise HTTPException(status_code=400, detail="Dominio no permitido")
    # ...
```

---

## API8: Security Misconfiguration

Configuraciones por defecto inseguras, headers de seguridad ausentes, mensajes de error verbose.

```python
# MAL — errores que revelan detalles internos
@app.exception_handler(Exception)
async def error_generico(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "traceback": traceback.format_exc()}  # nunca exponer
    )

# BIEN — errores genéricos al exterior, detalles en los logs internos
import logging
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def error_generico(request, exc):
    logger.error(f"Error no manejado: {exc}", exc_info=True)  # log interno detallado
    return JSONResponse(
        status_code=500,
        content={"error": "Error interno del servidor"}  # mensaje genérico al exterior
    )
```

---

## API9: Improper Inventory Management

APIs en versiones antiguas sin soporte de seguridad que siguen expuestas en producción.

**Señales de alerta:** endpoints `/v1/` cuando ya existe `/v3/`, endpoints de debug en producción (`/debug`, `/test`, `/__admin`), documentación Swagger habilitada en producción sin autenticación.

---

## API10: Unsafe Consumption of APIs

Confiar ciegamente en la respuesta de APIs de terceros sin validarla.

```python
# MAL — usar directamente la respuesta de una API externa sin validar
respuesta_externa = requests.get("https://api-tercero.com/datos").json()
nombre_usuario = respuesta_externa["nombre"]   # puede fallar si el campo no existe

# BIEN — validar la respuesta con Pydantic
from pydantic import BaseModel

class RespuestaExterna(BaseModel):
    nombre: str
    email: str

try:
    datos_validados = RespuestaExterna(**respuesta_externa)
    nombre_usuario = datos_validados.nombre
except ValidationError as e:
    logger.error(f"Respuesta inesperada de API externa: {e}")
    raise HTTPException(status_code=502, detail="Respuesta inválida de servicio externo")
```
