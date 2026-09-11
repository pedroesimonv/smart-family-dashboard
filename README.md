# 🏡 Smart Family Dashboard

[![Versión](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)]()
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)]()

Una aplicación *full-stack* en tiempo real diseñada para centralizar la gestión logística del hogar. Resuelve el problema de la fragmentación de información familiar mediante un panel pasivo de salón (TV/Tablet) y un centro de mando activo para dispositivos móviles.

🚀 **[Ver demostración en vivo (Vercel) -> [\smart-family-dashboard\docs\assets\muestraMovilPizarra.gif](https://smart-family-dashboard-five.vercel.app/)]**

## 💡 La Prueba del Delito (Real-Time Sync)
*La vista móvil (izquierda) actualiza instantáneamente el tablero de la TV (derecha) mediante WebSockets, sin recargar la página.*

![Demostración en tiempo real](./docs/assets/demo.gif)

## 🧠 Arquitectura y Decisiones de Diseño

* **Diseño Dual por Contexto de Uso:** Renderizado condicional del layout y el sistema de diseño (Light/Dark theme) basado en el viewport. 
    * **Móvil (Mando a distancia):** Tema claro, listas verticales y botones masivos (Hitboxes amigables).
    * **Desktop/TV (Tablero de corcho):** Tema oscuro asimétrico (CSS Grid 60/40) para lectura pasiva a distancia sin fatiga visual.
* **Sincronización Bidireccional:** Implementación de `Socket.io` para reflejar el estado mutado (MySQL) en todos los clientes conectados de manera inmediata.
* **Componentización Atómica:** UI extraída en componentes agnósticos (`<PostItCard>`, `<ActionBtn>`) inyectados con variables de diseño nativas de Tailwind v4.

## 🗺️ Roadmap de Desarrollo

- [x] **MVP (v1.0.0)**
  - [x] Sincronización en tiempo real (Backend Node/Express + WebSockets).
  - [x] Base de datos relacional dockerizada (MySQL).
  - [x] Centro de Mando del Perrete (Eventos).
  - [x] Lista de la Compra interactiva.
  - [x] Muro de Tareas (CRUD completo).
  - [x] Sistema de diseño dinámico (Móvil vs TV).
- [ ] **Iteraciones Futuras**
  - [ ] Sistema de autenticación de usuarios (Roles familiares).
  - [ ] Soporte completo PWA (Offline-first).