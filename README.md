# 🏡 Smart Family Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

> Una plataforma centralizada para la gestión familiar en tiempo real. Diseñada con una filosofía de doble uso: pantalla "Always-On" para el hogar (solo lectura/vista rápida) y PWA móvil para la interacción sobre la marcha.

## 📖 El Problema y la Solución
La asincronía de horarios dificulta la gestión de tareas diarias en casa. Las pizarras físicas fallan porque exigen estar frente a ellas. **Smart Family Dashboard** resuelve esto sincronizando las necesidades del hogar en tiempo real mediante WebSockets. Si un usuario añade una tarea desde su móvil, aparece instantáneamente en la pantalla del salón.

## 🚀 Características (Roadmap)

- [x] **Fase 1 (MVP): Muro de Tareas.** Asignación y gestión de tareas domésticas en tiempo real. *(Desplegado y Validado)*
- [ ] **Fase 2:** Lista de la Compra Dinámica.
- [ ] **Fase 3:** Centro de Mando del Perrete (seguimiento de comidas, paseos y veterinario).
- [ ] **Fase 4:** Calendario Compartido de Pareja.
- [ ] **Fase 5:** Alertas de Pagos y Finanzas.

## 🏗️ Arquitectura y Decisiones Técnicas

- **Frontend (PWA):** React.js. Layout adaptativo (Móvil vs Pantalla TV). Desplegado en Vercel.
- **Backend:** Node.js con Express.
- **Tiempo Real:** WebSockets (`Socket.io`) para garantizar actualizaciones en milisegundos y evitar cargas asíncronas.
- **Base de Datos:** MySQL estructurada relacionalmente.
- **Infraestructura:** Entorno de desarrollo local contenerizado con Docker. Túnel reverso temporal para pruebas en producción.

## 💡 Lecciones Aprendidas y Troubleshooting

Durante el desarrollo de la Fase 1, se resolvieron los siguientes bloqueos técnicos:

1. **Migración a Tailwind CSS v4:** Se adaptó la arquitectura del proyecto a la nueva versión prescindiendo de las directivas `@tailwind` clásicas, configurando manualmente el empaquetado con `@tailwindcss/postcss` y la sintaxis `@import`.
2. **Inyección de Variables Vercel:** Resolución de bloqueos de seguridad en el despliegue configurando `VITE_API_URL` como texto plano y depuración de caracteres nulos (`%20`) en las cadenas de conexión.
3. **Bypass de Pantallas de Intercepción (Ngrok):** Implementación de la cabecera HTTP `ngrok-skip-browser-warning` en las instancias de `axios`/`fetch` y en la configuración de *polling/websockets* de Socket.io para permitir la comunicación fluida del túnel reverso sin bloqueo del navegador.
4. **PWA y Hashing de Assets:** Blindaje de los iconos del Service Worker alojándolos en el directorio `public/` para evitar la mutación de rutas durante el proceso de *build* de Vite.

## ⚠️ Deuda Técnica Actual

- **Infraestructura de Red:** Migrar el túnel reverso efímero actual (Ngrok) a una red privada virtual de confianza cero (Tailscale) para dotar al servidor local de una IP estática, permanente y de acceso privado restringido a los dispositivos del hogar.

## 🛠️ Instalación y Uso (Entorno de Desarrollo)

### Prerrequisitos
- [Docker](https://www.docker.com/) y Docker Compose instalados.
- [Node.js](https://nodejs.org/) (v18 o superior).

### Pasos
1. Clona el repositorio:
   ```bash
   git clone [https://github.com/pedroesimonv/smart-family-dashboard.git](https://github.com/pedroesimonv/smart-family-dashboard.git)