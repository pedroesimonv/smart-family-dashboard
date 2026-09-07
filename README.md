# 🏡 Smart Family Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

> Una plataforma centralizada para la gestión familiar en tiempo real. Diseñada con una filosofía de doble uso: pantalla "Always-On" para el hogar (solo lectura/vista rápida) y PWA móvil para la interacción sobre la marcha.

## 📖 El Problema y la Solución
La asincronía de horarios dificulta la gestión de tareas diarias en casa. Las pizarras físicas fallan porque exigen estar frente a ellas. **Smart Family Dashboard** resuelve esto sincronizando las necesidades del hogar en tiempo real. Si un usuario añade una tarea desde su móvil en el trabajo, aparece instantáneamente en la pantalla del salón.

## 🚀 Características (Roadmap)

- [x] **Fase 1 (MVP): Muro de Tareas.** Asignación y gestión de tareas domésticas en tiempo real.
- [ ] **Fase 2:** Lista de la Compra Dinámica.
- [ ] **Fase 3:** Centro de Mando del Perrete (seguimiento de comidas, paseos y veterinario).
- [ ] **Fase 4:** Calendario Compartido de Pareja.
- [ ] **Fase 5:** Alertas de Pagos y Finanzas.

## 🏗️ Arquitectura y Decisiones Técnicas

- **Frontend (PWA):** React.js. Elegido por su ecosistema robusto y facilidad para crear interfaces reactivas. Desplegado en Vercel.
- **Backend:** Node.js con Express.
- **Tiempo Real:** WebSockets (`Socket.io`) para garantizar que la pantalla del hogar se actualice en milisegundos sin necesidad de refrescar.
- **Base de Datos:** MySQL estructurada relacionalmente para mantener la integridad de los datos de usuarios, tareas y eventos.
- **Infraestructura:** Contenerizado con Docker para garantizar la paridad entre entornos de desarrollo y producción.

## 🛠️ Instalación y Uso (Entorno de Desarrollo)

### Prerrequisitos
- [Docker](https://www.docker.com/) y Docker Compose instalados.
- [Node.js](https://nodejs.org/) (v18 o superior).

### Pasos
1. Clona el repositorio:
   ```bash
   git clone https://github.com/pedroesimonv/smart-family-dashboard