# Arquitectura del Sistema: Smart Family Dashboard

Este documento define la estructura y el flujo de datos del Producto Mínimo Viable (MVP). 

**Objetivo:** Sincronización en tiempo real de tareas del hogar entre múltiples clientes (Móvil PWA y Escritorio).

---

**1. Stack Tecnológico**
* **Frontend:** React (Vite), Tailwind CSS v4, PWA (vite-plugin-pwa).
* **Backend:** Node.js, Express.js.
* **Tiempo Real:** Socket.io.
* **Base de Datos:** MySQL 8.0 (Docker).

---

**2. Flujo de Datos y Tiempo Real**
El sistema utiliza una arquitectura híbrida de peticiones HTTP tradicionales y WebSockets para la reactividad.

1. **Carga Inicial (REST):** Al abrir la aplicación, React hace un `GET /api/tasks` mediante `fetch` para obtener el estado actual de la base de datos.
2. **Mutaciones (REST):** Cuando un usuario añade, completa o elimina una tarea, el frontend envía una petición HTTP (`POST`, `PUT` o `DELETE`) al servidor de Node.js.
3. **Persistencia (SQL):** Express recibe la petición, ejecuta la consulta SQL correspondiente contra el contenedor de MySQL y espera la confirmación.
4. **Propagación (WebSockets):** Si la base de datos se actualiza correctamente, Express utiliza Socket.io para emitir un evento `tasks_updated` a todos los clientes conectados.
5. **Re-renderizado (React):** Los clientes escuchan el evento `tasks_updated` e inmediatamente disparan una nueva petición `GET` para refrescar su interfaz sin intervención del usuario.

---

**3. Esquema de Base de Datos**
La persistencia se maneja mediante una única tabla relacional sencilla.

**Tabla:** `tasks`
* `id` (INT, Primary Key, Auto-increment): Identificador único de la tarea.
* `title` (VARCHAR 255, Not Null): Descripción de la tarea a realizar.
* `is_completed` (BOOLEAN, Default FALSE): Estado de la tarea (pendiente/tachada).
* `created_at` (TIMESTAMP, Default CURRENT_TIMESTAMP): Fecha de creación para ordenación.