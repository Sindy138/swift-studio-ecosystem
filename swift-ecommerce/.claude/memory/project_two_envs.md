---
name: project_two_envs
description: El proyecto completo tiene DOS entornos; en este repo solo se trabaja el ecommerce privado (swiftstudio360.com)
metadata:
  type: project
---

Swift Studio 360 tiene dos sitios diferenciados:

| Entorno | Dominio | Repo | Scope actual |
|---------|---------|------|--------------|
| Web pública | swiftstudio.com | Repo separado | Fuera de scope aquí |
| Ecommerce privado | swiftstudio360.com | Este repo (`swift-ecommerce`) | Todo el trabajo |

**Why:** Evitar confusión cuando Sindy mencione "la web" o "el proyecto" — siempre se refiere al ecommerce, no a la web pública de captación.

**How to apply:** Si hay dudas sobre si algo pertenece al ecommerce o a la web pública, preguntar antes de implementar. Toda decisión de arquitectura y stack en este repo aplica solo al entorno privado (swiftstudio360.com).
