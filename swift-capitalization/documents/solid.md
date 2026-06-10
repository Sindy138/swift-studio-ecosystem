# Principios SOLID

SOLID es un acrónimo de 5 principios para diseñar software orientado a objetos (y aplicable también en código funcional) que sea fácil de mantener y extender.

| Letra | Principio | Resumen |
|-------|-----------|---------|
| **S** | Single Responsibility | Una clase, una razón para cambiar |
| **O** | Open/Closed | Abierto a extensión, cerrado a modificación |
| **L** | Liskov Substitution | Los subtipos deben ser sustituibles por sus tipos base |
| **I** | Interface Segregation | Muchas interfaces pequeñas > una interfaz grande |
| **D** | Dependency Inversion | Depende de abstracciones, no de implementaciones concretas |

---

## S — Single Responsibility Principle (SRP)

> "Una clase debe tener una, y solo una, razón para cambiar."

```python
# ❌ Viola SRP — esta clase hace 3 cosas distintas
class GestorUsuario:
    def crear_usuario(self, datos: dict) -> Usuario:
        # lógica de negocio
        pass

    def guardar_en_db(self, usuario: Usuario):
        # acceso a base de datos
        conn = psycopg2.connect(DATABASE_URL)
        ...

    def enviar_email_bienvenida(self, usuario: Usuario):
        # envío de email
        smtplib.SMTP("smtp.gmail.com").sendmail(...)


# ✅ Cada clase tiene una sola responsabilidad
class ServicioUsuario:
    def __init__(self, repo: RepositorioUsuario, notificaciones: ServicioNotificaciones):
        self.repo = repo
        self.notificaciones = notificaciones

    def crear_usuario(self, datos: dict) -> Usuario:
        usuario = Usuario(**datos)
        self.repo.guardar(usuario)
        self.notificaciones.bienvenida(usuario)
        return usuario

class RepositorioUsuario:
    def guardar(self, usuario: Usuario): ...
    def obtener(self, id: int) -> Usuario: ...

class ServicioNotificaciones:
    def bienvenida(self, usuario: Usuario): ...
```

**¿Cuándo cambia `GestorUsuario` sin SRP?** Si cambia la BD, si cambia el proveedor de email, o si cambia la lógica de negocio. Son 3 razones independientes de cambio → viola SRP.

---

## O — Open/Closed Principle (OCP)

> "Una entidad debe estar abierta a extensión pero cerrada a modificación."

```python
# ❌ Viola OCP — añadir un nuevo tipo de descuento requiere modificar esta función
def calcular_descuento(tipo: str, precio: float) -> float:
    if tipo == "estudiante":
        return precio * 0.8
    elif tipo == "jubilado":
        return precio * 0.7
    elif tipo == "empleado":
        return precio * 0.6
    # Para añadir "vip" hay que tocar este código y arriesgarse a romper los demás


# ✅ Cumple OCP — extender sin modificar
from abc import ABC, abstractmethod

class Descuento(ABC):
    @abstractmethod
    def aplicar(self, precio: float) -> float:
        pass

class DescuentoEstudiante(Descuento):
    def aplicar(self, precio: float) -> float:
        return precio * 0.8

class DescuentoJubilado(Descuento):
    def aplicar(self, precio: float) -> float:
        return precio * 0.7

class DescuentoVIP(Descuento):  # nuevo tipo sin tocar nada anterior
    def aplicar(self, precio: float) -> float:
        return precio * 0.5

def calcular_descuento(descuento: Descuento, precio: float) -> float:
    return descuento.aplicar(precio)
```

---

## L — Liskov Substitution Principle (LSP)

> "Si S es un subtipo de T, los objetos de tipo T pueden ser sustituidos por objetos de tipo S sin alterar el comportamiento correcto del programa."

En lenguaje simple: **los hijos deben cumplir el contrato del padre**.

```python
# ❌ Viola LSP — el hijo cambia el comportamiento esperado
class Ave:
    def volar(self) -> str:
        return "Estoy volando"

class Pinguino(Ave):
    def volar(self):
        raise NotImplementedError("Los pingüinos no vuelan")
        # Si el código espera un Ave y le das un Pinguino, se rompe


# ✅ Cumple LSP — jerarquía correcta
class Ave:
    def moverse(self) -> str:
        pass

class AveVoladora(Ave):
    def moverse(self) -> str:
        return "Volando"

class AveAcuatica(Ave):
    def moverse(self) -> str:
        return "Nadando"

class Aguila(AveVoladora): ...
class Pinguino(AveAcuatica): ...

# Cualquier Ave se puede usar donde se espera Ave — LSP cumplido
def hacer_mover(ave: Ave):
    print(ave.moverse())
```

**Aplicado a FastAPI/Python:**

```python
# ❌ Viola LSP — la subclase rompe la firma esperada
class RepositorioBase:
    def obtener(self, id: int) -> Usuario:
        pass

class RepositorioCache(RepositorioBase):
    def obtener(self, id: int, usar_cache: bool = True) -> Usuario | None:
        # Cambia el tipo de retorno — puede devolver None cuando el padre siempre devuelve Usuario
        pass

# ✅ Cumple LSP — la subclase respeta el contrato
class RepositorioCache(RepositorioBase):
    def obtener(self, id: int) -> Usuario:
        cached = self.cache.get(id)
        if cached:
            return cached
        return self.db.obtener(id)  # siempre devuelve Usuario, nunca None
```

---

## I — Interface Segregation Principle (ISP)

> "Los clientes no deben verse obligados a depender de interfaces que no usan."

```python
# ❌ Viola ISP — interfaz demasiado grande
from abc import ABC, abstractmethod

class Trabajador(ABC):
    @abstractmethod
    def trabajar(self): pass
    @abstractmethod
    def descansar(self): pass
    @abstractmethod
    def cobrar(self): pass
    @abstractmethod
    def reportar_horas(self): pass

class Robot(Trabajador):
    def trabajar(self): ...
    def descansar(self):
        raise NotImplementedError("Los robots no descansan")  # ← forzado a implementar algo imposible
    def cobrar(self):
        raise NotImplementedError("Los robots no cobran")


# ✅ Cumple ISP — interfaces segregadas
class Trabajador(ABC):
    @abstractmethod
    def trabajar(self): pass

class Descansable(ABC):
    @abstractmethod
    def descansar(self): pass

class Cobrable(ABC):
    @abstractmethod
    def cobrar(self): pass

class EmpleadoHumano(Trabajador, Descansable, Cobrable):
    def trabajar(self): ...
    def descansar(self): ...
    def cobrar(self): ...

class Robot(Trabajador):
    def trabajar(self): ...  # solo implementa lo que necesita
```

**En Python (Protocols):**

```python
from typing import Protocol

class Guardable(Protocol):
    def guardar(self, datos: dict) -> bool: ...

class Consultable(Protocol):
    def obtener(self, id: int) -> dict: ...

# Los servicios dependen solo de lo que necesitan
class ServicioBackup:
    def __init__(self, storage: Guardable):  # no necesita saber consultar
        self.storage = storage
```

---

## D — Dependency Inversion Principle (DIP)

> "Los módulos de alto nivel no deben depender de los de bajo nivel. Ambos deben depender de abstracciones."

```python
# ❌ Viola DIP — el servicio de alto nivel depende de la implementación concreta
class ServicioNotificaciones:
    def __init__(self):
        self.email = SmtpEmailSender()  # acoplado a SMTP directamente

    def notificar(self, usuario: Usuario, mensaje: str):
        self.email.enviar(usuario.email, mensaje)


# ✅ Cumple DIP — depende de la abstracción
from abc import ABC, abstractmethod

class EnviadorMensaje(ABC):
    @abstractmethod
    def enviar(self, destino: str, mensaje: str) -> bool:
        pass

class SmtpEmailSender(EnviadorMensaje):
    def enviar(self, destino: str, mensaje: str) -> bool:
        # implementación SMTP
        pass

class SendGridSender(EnviadorMensaje):
    def enviar(self, destino: str, mensaje: str) -> bool:
        # implementación SendGrid
        pass

class SlackSender(EnviadorMensaje):
    def enviar(self, destino: str, mensaje: str) -> bool:
        # implementación Slack
        pass

class ServicioNotificaciones:
    def __init__(self, enviador: EnviadorMensaje):  # inyección de dependencia
        self.enviador = enviador

    def notificar(self, usuario: Usuario, mensaje: str):
        self.enviador.enviar(usuario.email, mensaje)

# Uso — fácil de cambiar o mockear en tests
servicio = ServicioNotificaciones(enviador=SmtpEmailSender())
servicio_test = ServicioNotificaciones(enviador=MockSender())  # en tests
```

**DIP + FastAPI con Depends:**

```python
from fastapi import Depends

def get_repo() -> RepositorioUsuario:
    return PostgresRepositorioUsuario()

@app.get("/usuarios/{id}")
def get_usuario(id: int, repo: RepositorioUsuario = Depends(get_repo)):
    return repo.obtener(id)
    # En tests: override get_repo con un repositorio en memoria
```

---

## Resumen visual

```
KISS   → ¿Es la solución más simple que funciona? Si no, simplifica.
DRY    → ¿Este conocimiento está en un solo lugar? Si no, extrae.
YAGNI  → ¿Lo necesitas ahora? Si no, no lo construyas.
SRP    → ¿Cuántas razones tiene esta clase para cambiar? Debe ser 1.
OCP    → ¿Puedes añadir funcionalidad sin modificar lo existente? Debes poder.
LSP    → ¿El hijo puede sustituir al padre sin sorpresas? Debe poder.
ISP    → ¿Implementas métodos que no usas? Divide la interfaz.
DIP    → ¿Dependes de la implementación concreta? Depende de la abstracción.
```
