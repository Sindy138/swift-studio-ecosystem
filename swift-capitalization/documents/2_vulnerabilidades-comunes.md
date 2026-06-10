# Vulnerabilidades Comunes en el Stack del Curso

## SQL Injection

Un atacante inyecta SQL malicioso en un input de usuario que se concatena directamente en una query.

```python
# MAL — concatenación directa de input del usuario en SQL
@app.get("/api/usuarios/buscar")
def buscar_usuario(nombre: str, db: Session = Depends(get_db)):
    # Si nombre = "admin' OR '1'='1", devuelve TODOS los usuarios
    # Si nombre = "admin'; DROP TABLE usuarios; --", borra la tabla
    query = f"SELECT * FROM usuarios WHERE nombre = '{nombre}'"
    return db.execute(text(query)).fetchall()

# BIEN — usar parámetros con SQLAlchemy/Prisma (nunca concatenar)
@app.get("/api/usuarios/buscar")
def buscar_usuario(nombre: str, db: Session = Depends(get_db)):
    # SQLAlchemy escapa automáticamente los parámetros
    usuarios = db.query(Usuario).filter(Usuario.nombre == nombre).all()
    return usuarios
```

**Buena noticia:** Prisma y SQLAlchemy protegen automáticamente contra SQL injection si usas sus APIs nativas. El peligro aparece cuando usas `text()` con f-strings.

---

## XSS (Cross-Site Scripting) en React

React escapa automáticamente el contenido renderizado en JSX. El peligro está en los casos donde se desactiva este comportamiento.

```jsx
// MAL — dangerouslySetInnerHTML con contenido no sanitizado
function MostrarContenido({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
  // Si html = "<script>document.cookie</script>", se ejecuta el script
}

// BIEN — renderizar como texto (React escapa automáticamente)
function MostrarContenido({ texto }) {
  return <div>{texto}</div>   // React convierte < en &lt; automáticamente
}

// Si necesitas renderizar HTML (ej: contenido de un editor rico), sanitizar primero
import DOMPurify from "dompurify"

function MostrarHtml({ html }) {
  const htmlSeguro = DOMPurify.sanitize(html)  // elimina scripts maliciosos
  return <div dangerouslySetInnerHTML={{ __html: htmlSeguro }} />
}
```

---

## CORS mal configurado

CORS (Cross-Origin Resource Sharing) controla qué dominios pueden hacer peticiones a tu API. Una configuración demasiado permisiva permite que cualquier web haga peticiones autenticadas en nombre del usuario.

```python
# MAL — permitir cualquier origen (permite ataques CSRF)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # cualquier dominio puede hacer peticiones
    allow_credentials=True,    # incluyendo con cookies/credenciales
)
# allow_origins=["*"] y allow_credentials=True es inválido y rechazado por los navegadores,
# pero indica una configuración pensada incorrectamente

# BIEN — listar explícitamente los orígenes permitidos
ORIGENES_PERMITIDOS = [
    "https://mi-app.netlify.app",     # frontend en producción
    "http://localhost:3000",          # frontend local en desarrollo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENES_PERMITIDOS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

---

## Gestión de secretos

Las credenciales (API keys, contraseñas de BD, JWT secrets) nunca deben estar hardcoded en el código ni en el repositorio.

```python
# MAL — credenciales en el código
SECRET_KEY = "mi-clave-super-secreta"
DATABASE_URL = "postgresql://admin:admin123@localhost/db"

# MAL — en el archivo de configuración que se sube a git
# config.py con credenciales reales

# BIEN — leer de variables de entorno
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está configurada — revisa tu archivo .env")
```

**Checklist de secretos:**
- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` existe y documenta todas las variables necesarias
- [ ] `git log --all -- .env` no muestra historial (si se subió antes, rotar las credenciales)
- [ ] Los secretos en producción están en el panel de la plataforma (Railway, Render, Netlify), no en archivos

---

## Rate Limiting

Sin rate limiting, tu API es vulnerable a ataques de fuerza bruta y a costes desorbitados en endpoints de IA.

```python
# Instalar: pip install slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Rate limit en endpoints críticos
@app.post("/api/login")
@limiter.limit("5/minute")   # máximo 5 intentos de login por minuto por IP
async def login(request: Request, credenciales: LoginInput):
    # ...

@app.post("/api/chat")
@limiter.limit("20/minute")  # limitar llamadas al LLM para controlar costes
async def chat(request: Request, mensaje: ChatInput):
    # ...
```

---

## Headers de seguridad

Los headers HTTP de seguridad indican al navegador cómo manejar el contenido de la app.

```python
# Añadir headers de seguridad a todas las respuestas
from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        respuesta = await call_next(request)

        # Evitar que el sitio sea embebido en iframes (protege contra clickjacking)
        respuesta.headers["X-Frame-Options"] = "DENY"

        # Evitar que el navegador "adivine" el tipo de contenido
        respuesta.headers["X-Content-Type-Options"] = "nosniff"

        # Forzar HTTPS en navegadores que ya visitaron el sitio
        respuesta.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Controlar qué información de referencia se envía
        respuesta.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return respuesta

app.add_middleware(SecurityHeadersMiddleware)
```

---

## Validación en boundaries

Nunca confiar en los datos que llegan del exterior. Validar siempre en el punto de entrada.

```python
# MAL — aceptar cualquier input sin validación
@app.post("/api/usuario")
def crear_usuario(datos: dict):
    # datos puede contener cualquier cosa
    db.execute("INSERT INTO usuarios...", datos)

# BIEN — Pydantic valida y sanitiza automáticamente
from pydantic import BaseModel, EmailStr, field_validator
import re

class UsuarioInput(BaseModel):
    nombre: str
    email: EmailStr   # Pydantic valida el formato del email automáticamente
    edad: int

    @field_validator("nombre")
    @classmethod
    def nombre_valido(cls, v):
        if len(v) < 2 or len(v) > 100:
            raise ValueError("El nombre debe tener entre 2 y 100 caracteres")
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', v):
            raise ValueError("El nombre solo puede contener letras y espacios")
        return v.strip()

    @field_validator("edad")
    @classmethod
    def edad_valida(cls, v):
        if v < 0 or v > 150:
            raise ValueError("Edad no válida")
        return v

@app.post("/api/usuario")
def crear_usuario(datos: UsuarioInput):
    # Si llega aquí, los datos son válidos y sanitizados
    pass
```
