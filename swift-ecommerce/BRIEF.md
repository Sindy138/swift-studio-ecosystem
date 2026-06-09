# Proyecto Final — Aplicación Fullstack con IA Integrada

## Descripción general

El **proyecto final** es la culminación del bootcamp. Deberás construir una aplicación web fullstack que integre un agente de IA como parte central del producto — no como una función secundaria.

La aplicación debe ser **funcional, desplegada y defendible**: en la presentación explicarás tus decisiones técnicas y harás una demo en vivo donde la IA sea protagonista.

---

## Cosas a tener en cuenta

1. Para sustituir, modificar o eliminar cualquier tecnología de los requisitos, consulta previamente. El proyecto se puede adaptar dentro de cierto rango.
2. Los requisitos técnicos obligatorios son los establecidos por defecto, pero se pueden modificar. 
3. El proyecto se puede hacer hasta por parejas. Pero cada miembro de pareja debe reflejar el trabajo realizado manteniendo su propia rama en github. 
4. La fecha límite de entrega del proyecto será el Lunes 15 a las 18:00, hora canaria
5. El proyecto debe ir asociado a una presentación del mismo. Tiempo límite 10 minutos. Ni un solo segundo más. 
6. Es obligatorio e insustituible que el proyecto tenga un front, un back, una automatización y alguna relación con IA. 
7. Es obligatorio e insustituible que el proyecto esté bien documentado (swagger, readme, uso de IA, postman.json)

---

## Requisitos técnicos obligatorios

### Backend — Python + FastAPI

- [ ] **Node** con security y/o **FastAPI** con Pydantic v2 para validación
- [ ] **PostgreSQL** con al menos 3 tablas relacionadas
- [ ] **Autenticación JWT** (registro, login, rutas protegidas)
- [ ] **Agente LangChain/LangGraph** integrado
- [ ] **RAG con ChromaDB** o similar (al menos 5 documentos pre-indexados)
- [ ] **Al menos 1 workflow N8N** conectado a la API
- [ ] **Endpoints IA**: `POST /api/chat`, `GET /api/chat/history/{id}`
- [ ] **Variables de entorno** para todas las claves y configuraciones sensibles (.env y .env.example)
- [ ] **Manejo de errores** centralizado con respuestas descriptivas

### Frontend — React

- [ ] **React 18+** con Vite
- [ ] **React Router v6** con al menos 3 rutas
- [ ] **Interfaz de chat** para interactuar con el agente de IA
- [ ] **Context API** para estado global (usuario autenticado)
- [ ] **Formularios** con validación en el cliente
- [ ] **Diseño responsive** (mobile y desktop)
- [ ] **Gestión de estados** de carga, error y datos vacíos

### IA — LangChain + RAG

- [ ] **Agente LangGraph** con al menos 2 tools
- [ ] **Memoria conversacional** que persiste entre turnos
- [ ] **RAG** sobre documentos del dominio del proyecto
- [ ] Las respuestas **citan las fuentes** cuando usan RAG
- [ ] El agente maneja **errores y casos límite** apropiadamente

### Automatización — N8N

- [ ] Al menos **1 workflow activo** conectado a la API
- [ ] El workflow tiene **lógica condicional** (nodo IF o Switch)
- [ ] Los workflows están **exportados como JSON** en el repositorio

### Despliegue

- [ ] **Backend desplegado** (Railway, Render, Fly.io)
- [ ] **Frontend desplegado** (Netlify, Vercel)
- [ ] **Base de datos en la nube** (Railway, Supabase, Neon)
- [ ] Las dos aplicaciones se comunican en producción
- [ ] El agente de IA funciona en producción

---

## Arquitectura recomendada

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │  Auth    │  │  Pages   │  │  Chat    │  │   Context API  │  │
│  │ Context  │  │ + Router │  │  Widget  │  │  (user, chat)  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       └─────────────┴─────────────┴────────────────┘           │
│                           │ fetch/axios (JWT)                   │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS
                            │
┌───────────────────────────┼─────────────────────────────────────┐
│                   BACKEND (FastAPI)                             │
│                           │                                     │
│    ┌─────────────────────►│◄──────────────────────────────┐    │
│    │                 Routers                               │    │
│    │       ┌─────────┬────┴─────┬──────────┐              │    │
│    │   /auth      /recursos   /api/chat   /webhook         │    │
│    │       └────────────────────────────────┘              │    │
│    │                      │                                │    │
│    │               LangGraph Agent                         │    │
│    │              /             \                          │    │
│    │      Tools:RAG         Tools:DB                       │    │
│    │           ↓                 ↓                         │    │
│    │       ChromaDB         PostgreSQL                     │    │
│    │    (documentos)         (datos)                       │    │
│    │                                                       │    │
│    └──────────────── N8N (webhooks) ──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura de repositorios

### Opción A: Monorepo (recomendada)

```
mi-proyecto-final/
├── frontend/              # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── hooks/
│   ├── package.json
│   └── .env.example
├── backend/               # FastAPI
│   ├── main.py
│   ├── config.py
│   ├── agent/
│   │   ├── agent.py
│   │   └── tools.py
│   ├── routers/
│   ├── models/
│   ├── docs/              # documentos para RAG
│   ├── requirements.txt
│   └── .env.example
├── n8n-workflows/         # workflows exportados
│   └── *.json
└── README.md
```

---

## Estructura de la presentación (10 minutos)

> Aunque en esta ocasión tengas 10 minutos, mi recomendación es que intentes entrar en 5-6. Tómatelo como que la presentación son de 5-6 minutos pero que tienes mucho margen para acabar. ¡NO INTENTES APURAR EL TIEMPO!

1. **Introducción** (30s): ¿qué hace tu app? ¿Qué problema resuelve? ¿A quién va dirigida?
2. **Demo en vivo** (3 min):
   - Login / registro
   - Funcionalidad principal (CRUD)
   - **La IA en acción** (chat, RAG, agente) — este es el momento clave
   - Si tienes N8N activo, muéstralo
3. **Arquitectura técnica** (90s):
   - Muestra el diagrama de arquitectura
   - Explica una decisión técnica interesante que tomaste
   - Muestra el código del agente o de la chain RAG
4. **Reflexión** (60s):
   - Mayor reto técnico encontrado
   - Qué mejorarías con más tiempo
   - Qué aprendiste sobre IA que no sabías antes del módulo

---

## Recursos útiles

### Despliegue
- [Railway](https://railway.app) — FastAPI + PostgreSQL
- [Render](https://render.com) — alternativa a Railway
- [Fly.io](https://fly.io) — FastAPI con más control
- [Netlify](https://netlify.com) — React frontend
- [Vercel](https://vercel.com) — alternativa a Netlify
- [Neon](https://neon.tech) — PostgreSQL serverless gratuito
- [Supabase](https://supabase.com) — PostgreSQL + storage

### IA
- [OpenAI Platform](https://platform.openai.com) — API keys y límites de uso
- [LangChain Docs](https://python.langchain.com) — documentación oficial
- [LangGraph Docs](https://langchain-ai.github.io/langgraph) — agentes con grafos
- [ChromaDB Docs](https://docs.trychroma.com) — base de datos vectorial

### Herramientas de apoyo
- [Excalidraw](https://excalidraw.com) — diagramas de arquitectura
- [DBDiagram](https://dbdiagram.io) — diagramas de base de datos
- [Mailtrap](https://mailtrap.io) — pruebas de email en desarrollo
