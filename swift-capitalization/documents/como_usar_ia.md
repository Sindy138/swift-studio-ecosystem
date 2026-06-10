# Cómo documentar el uso de IA en el proyecto

## Por qué documentar, no censurar

En este curso **el uso de IA está permitido y es bienvenido**. Las herramientas como ChatGPT, GitHub Copilot o Claude forman parte del ecosistema real de desarrollo.

Lo que se pide no es que las evites, sino que las uses con cabeza y que dejes constancia de cómo las usas. El objetivo no es pillarte en nada — es exactamente lo contrario: ayudarte a aprender más y a entender cuánto progresas.

Documentar el uso de IA es un acto de honestidad técnica, igual que documentar una decisión de arquitectura o dejar un comentario explicando por qué elegiste una solución sobre otra.

---

## Qué registrar en cada interacción

Cada vez que uses una herramienta de IA para resolver algo del proyecto, anota:

1. **Qué problema tenías** — no el código, la situación: "no sabía cómo hacer la relación muchos-a-muchos en Prisma"
2. **Qué le preguntaste** — el prompt exacto o una paráfrasis fiel
3. **Qué te dio** — un resumen de la respuesta o el fragmento de código
4. **Qué cambiaste o descartaste** — qué no funcionó directamente, qué adaptast
5. **Qué aprendiste** — esto es lo más importante: ¿entiendes ahora lo que hace ese código?

---

## Formato de log: plantilla

Crea un fichero `ai_log.md` en la raíz de tu proyecto y usa esta estructura. Una entrada por sesión de IA significativa:

```markdown
## YYYY-MM-DD — [Funcionalidad o área]

- **Herramienta:** ChatGPT 4o / GitHub Copilot / Claude / etc.
- **Contexto:** qué estaba intentando hacer cuando recurrí a la IA
- **Prompt usado:** "..."
- **Qué obtuvo:** descripción breve del output (código, explicación, error resuelto...)
- **Qué modificó o descartó:** qué no funcionó directo / qué tuve que adaptar
- **Tiempo con IA:** X min | **Tiempo sin IA (estimado):** X min
- **Aprendizaje:** qué entendí que antes no sabía / qué sigo sin entender
```

No hace falta que sea perfecta ni que ocupe un folio. Tres líneas honestas valen más que un párrafo que no dice nada.

---

## Ejemplos: buena vs mala documentación

### Documentación pobre (no sirve)

```markdown
## 2025-05-06 — Backend

- Herramienta: ChatGPT
- Prompt: "ayúdame con prisma"
- Qué obtuvo: el código
- Aprendizaje: aprendí a usar prisma
```

Esto no documenta nada. No dice qué problema había, qué salió, si lo entendiste.

---

### Documentación útil

```markdown
## 2025-05-06 — Relaciones en Prisma (User → Post)

- **Herramienta:** ChatGPT 4o
- **Contexto:** No entendía cómo declarar una relación 1:N en el schema y que Prisma
  generara los campos correctos en la migración.
- **Prompt usado:** "En Prisma, cómo defino una relación uno a muchos entre User y Post
  para que cada post tenga un authorId obligatorio?"
- **Qué obtuvo:** Ejemplo completo del schema con @relation, @id y los campos inversos.
- **Qué modificó:** Cambié el nombre del campo de `authorId` a `userId` para mantener
  consistencia con el resto del proyecto. Tuve que añadir onDelete: Cascade yo solo
  porque no lo mencionó.
- **Aprendizaje:** Entendí que el campo de relación y el campo escalar son distintos en
  Prisma y que ambos son necesarios. Sigo sin tener claro cuándo usar `references`.
```

Esto sí es útil. Puedes releerlo en dos semanas y reconstruir lo que aprendiste.

---

## Beneficios concretos para ti

**Detectas tus lagunas reales.**
Cuando escribes "sigo sin entender X", te obligas a reconocer lo que no sabes. Eso es lo primero que necesitas para aprenderlo de verdad.

**Mejoras tus prompts.**
Si documentas qué prompts funcionaron y cuáles no, en pocos días empiezas a ver patrones. Dar contexto, ser específico, pedir formato... la calidad de tu prompt determina la calidad de la respuesta.

**Tienes un diario técnico real.**
En entrevistas o en el README del proyecto, poder decir "usé IA para X pero lo adapté porque Y" demuestra criterio técnico. Es mucho más valioso que pretender que escribiste todo desde cero.

**Mides tu curva de aprendizaje.**
Si en la semana 1 tardabas 40 minutos en algo con IA y en la semana 3 tardas 10, eso se ve en el log. Es evidencia de que estás aprendiendo, no dependiendo.

---

## La honestidad como herramienta de medición

Cuando los alumnos documentan de forma honesta, el docente puede:

- **Detectar dónde el curso falla** — si todos usan IA para lo mismo, probablemente esa parte no se explicó bien o necesita más práctica
- **Calibrar la dificultad real** — los tiempos estimados sin IA revelan qué conceptos cuestan más
- **Adaptar el ritmo** — si el log muestra que la IA resuelve el 80% de los tests pero nadie entiende lo que hace, hay que parar y reforzar

Para ti como alumno, la honestidad tiene un efecto directo: **si no documentas, no puedes mejorar lo que no ves**. El log no es un control — es un espejo.

---

## Lo que no cuenta como uso honesto

- Copiar y pegar código sin leerlo ni entenderlo, y no documentarlo
- Escribir en el log "lo entendí todo" cuando en realidad no modificaste nada y no podrías explicarlo
- Inventarte tiempos estimados para quedar bien
- No usar el log porque "da pereza" — si usas IA, lo anotas, aunque sea en dos líneas

El criterio no es cuánto usas la IA. Es si sabes lo que tienes en tu proyecto.

---