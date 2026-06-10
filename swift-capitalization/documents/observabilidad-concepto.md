# Observabilidad: Conceptos Fundamentales

## Los 3 pilares de la observabilidad

La observabilidad es la capacidad de entender el estado interno de un sistema a partir de sus salidas externas. Se sostiene en tres pilares:

| Pilar | Qué mide | Herramientas típicas |
|-------|----------|---------------------|
| **Logs** | Eventos que ocurrieron | ELK Stack, CloudWatch, Loki |
| **Métricas** | Valores numéricos en el tiempo | Prometheus, Grafana, Datadog |
| **Trazas** | El camino completo de una petición | Jaeger, Zipkin, OpenTelemetry |

```
Ejemplo de traza en una app web:
Usuario hace click
    └── Petición HTTP al servidor (12ms)
            └── Query a la base de datos (8ms)
                    └── Procesamiento (2ms)
                            └── Respuesta HTTP (2ms)
Total: 24ms
```

---

## Por qué los LLMs necesitan observabilidad específica

Una app web falla de forma binaria: o responde o no responde. Un sistema de IA falla de formas mucho más sutiles:

```
App web sin observabilidad: sabes si falla
App con IA sin observabilidad: no sabes si...
  - El prompt cambió y las respuestas empeoraron
  - Una versión del prompt es un 30% más cara sin ser mejor
  - El 15% de las peticiones está generando respuestas fuera de tema
  - Los usuarios reformulan la misma pregunta 3 veces (no entienden la respuesta)
  - El modelo llena el contexto con información irrelevante del RAG
```

Las herramientas de observabilidad general (Prometheus, Grafana) miden latencia y errores HTTP, pero no pueden responder preguntas como:
- ¿Qué prompt exacto generó esta respuesta?
- ¿Cuántos tokens consumió el contexto del RAG vs la respuesta?
- ¿La calidad de las respuestas ha bajado tras cambiar el modelo?

---

## Qué medir en un sistema de IA

### Métricas operacionales (las mismas que cualquier API)

| Métrica | Descripción | Alerta si... |
|---------|-------------|--------------|
| Latencia p50/p95 | Tiempo de respuesta | > 5s en p95 |
| Tasa de errores | Peticiones fallidas / total | > 1% |
| Disponibilidad | Tiempo activo | < 99.9% |

### Métricas específicas de LLM

| Métrica | Descripción | Alerta si... |
|---------|-------------|--------------|
| Tokens de input | Tokens enviados al LLM | Sube > 20% sin justificación |
| Tokens de output | Tokens generados | Demasiados → coste alto |
| Coste por petición | USD por request | > umbral definido |
| Latencia del LLM | Tiempo de la llamada al modelo | > 10s |
| Tasa de rechazo | Respuestas filtradas por seguridad | > 0.5% |

### Métricas de calidad (las más difíciles)

| Métrica | Descripción |
|---------|-------------|
| Relevancia | ¿La respuesta contiene la información pedida? |
| Fidelidad | ¿La respuesta está fundamentada en el contexto (RAG)? |
| Coherencia | ¿La respuesta tiene sentido internamente? |
| Score de usuario | Valoración explícita (👍/👎) |

---

## El problema del prompt drift

El prompt drift ocurre cuando el comportamiento del sistema cambia sin que nadie lo haya modificado intencionalmente. Puede pasar por:

- El modelo base se actualiza silenciosamente (gpt-4o-mini en octubre vs en marzo)
- Los datos de entrada cambian (los usuarios empiezan a hacer preguntas de otro tipo)
- Una dependencia del contexto RAG genera chunks distintos

Sin trazabilidad, es imposible detectar y diagnosticar el prompt drift. Con LangFuse, puedes ver exactamente qué prompt recibió el LLM en cada petición y comparar la calidad antes/después de cualquier cambio.

---

## Herramientas del ecosistema

| Herramienta | Enfoque | Plan gratuito |
|-------------|---------|---------------|
| **LangFuse** | Trazabilidad + evaluación | Sí (cloud y self-hosted) |
| **LangSmith** | Trazabilidad + datasets | Sí (limitado) |
| **Arize Phoenix** | Evaluación y debugging | Sí (open-source) |
| **Weights & Biases** | Experimentos y fine-tuning | Sí (limitado) |
| **Helicone** | Proxy + analytics | Sí (limitado) |

**En este curso usamos LangFuse** por tener la mejor integración con LangChain, ser open-source y tener self-hosting disponible.
