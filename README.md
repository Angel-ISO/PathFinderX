<div align="center">
  <img src="./media/PatFindersX.png" alt="Logo" height="200">
  <h2>Capstone - Path finderX</h2>
  <h4>By Angel Gabriel Ortega Corzo</h4>
</div>

<div align="center">
    <a href="https://gitlab.com/your-repo-path/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
    </a>
    <a href="https://gitlab.com/your-repo-path/releases">
        <img src="https://img.shields.io/badge/release-latest-blue?style=for-the-badge" alt="Latest Version">
    </a>
    <a href="https://gitlab.com/your-repo-path/issues">
        <img src="https://img.shields.io/badge/issues-open-red?style=for-the-badge" alt="Open Issues">
    </a>
    <a href="https://gitlab.com/your-repo-path/graphs/main">
        <img src="https://img.shields.io/badge/contributors-1-orange?style=for-the-badge" alt="Contributors">
    </a>
</div>

<br>

<div align="center">
  RESTful API to manage pathfinding services. Currently, only PathFinderX has been implemented for Bucaramanga, Colombia, with additional services to be implemented soon.
</div>

---

## 🚀 Features

- Real-world routing on Bucaramanga, Colombia map using Leaflet, rendering polylines and markers for start/end/stops/obstacles.
- Total distance calculation using Haversine formula (meters/kilometers) from lat/lon coordinates.
- Route algorithm over street graph (nodes and edges), returning { route: [{ id, lat, lon }], totalDistance } from backend.
- RESTful API documented with Swagger (endpoint /api-docs) to test route calculation and other resources.
- Reactive and responsive frontend (mobile and desktop), with loading/error state management and route panel.

---

## 🔎 Key Differences / What was requested vs. what I built

The original challenge asked for a "game-style" pathfinder (grid and abstract obstacles). I took it to a real-world environment: using geographic coordinates (lat/lon), Haversine distance, street graph, and a UI with Leaflet that draws routes and points (start, end, stops).

- I don't use "maps" by UUID or fixed dimensions: I work on a real map with a network of nodes/edges.
- Validation is geographic (reachable nodes, existing path) and distance is real (meters/km).
- Backend exposes a consistent API: { route: [{id, lat, lon}], totalDistance }.
- UX is professional: responsive, route panel, markers, and state/error handling.

Read the complete explanation, in first person and humanized, here: [keydiferences.md](./media/docs/keydiferences.md)

---

## 📐 SOLID Principles

Summary of how I applied SOLID principles in the project (SRP, OCP, LSP, ISP, DIP), with real examples from services, repositories, and interceptors.

- Single responsibility in services (e.g.: Auth/User) and persistence separation in repositories.
- Extensibility via interceptors and composition, avoiding modification of stable code.
- Abstractions and dependency inversion in the service layer.

Complete document: [SOLID_Principles.md](./media/docs/SOLID_Principles.md)

---

## 🧠 Pathfinding Optimizations and Validations

- I explain how the professor's requirements (stop validation, reachability, complex geometries, optimal routes, invalid inputs, and handling large maps) map to our real implementation with graph, KD-Tree, A*, and cache.
- Additionally, I document our response caching approach (namespace + method + URL + body hash, TTL, sliding expiration, and X-Cache headers).

Read the document: [OptimizacionesPatFinderx.md](./media/docs/OptimizacionesPatFinderx.md)

---

## 🧩 In-Memory Graph and Cache

- How we store KD-Tree and graph in memory, how we implemented warm-up, and why we prefer caching responses in Redis instead of persisting the graph.
- Fault tolerance and security considerations.

Read the document: [GrafoEnMemoria_y_Cache.md](./media/docs/GrafoEnMemoria_y_Cache.md)

---

## 🏗️ Backend Architecture

- Layers, main flow, technical decisions, best practices, and testing.

Read the document: [ArquitecturaBackend.md](./media/docs/ArquitecturaBackend.md)

---

## 💻 Technologies Used

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="Node.js logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="JavaScript logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" alt="Express logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" alt="Git logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="40" alt="MongoDB logo" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" height="40" alt="Swagger logo" />
</div>

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone https://gitlab.com/angel_374/programing-4t.git
cd programing-4t
```

2. Install dependencies:

```bash
npm i
```

3. Configure the environment:

Create a `.env` file in the root directory and add your database connection string and other necessary variables described in the `.env.example` file [.env.example](./.env.example):

```
PORT=3000
MONGODB_URI=your_mongodb_connection
```

4. Start the server:

```bash
npm start
```

5. Access the Swagger Docs:

```
http://localhost:3000/api-docs
```

---

## 📂 API Documentation

You can find the API documentation inside the `config/ConfigSwagger.js` file or by visiting `/api-docs` after running the project locally, or you can check the swagger docs [swagger.yml](/media//docs/swagger.yml).

---

## 🤝 Contributing

We welcome contributions from the community. Please read the [contributing guidelines](./CONTRIBUTING.md) before submitting a pull request.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./Licence.md) file for details.

---

## Video Explanation

  <p align="center">
    <a href="https://www.youtube.com/watch?v=veMzpxcbixg">
      <img src="./media/preview video.png" alt="Video preview" width="600" height="400">
    </a>
  </p>