# eBookStore Mock Server - Archived Reference

> ⚠️ **IMPORTANT: This is an ARCHIVED REFERENCE**  
> This backend implementation is **NOT currently used** in the CodeBook e-commerce project.  
> The current project uses **AWS Lambda functions** with **DynamoDB** as the backend (see `codebook/aws-lambda/`).  
> This directory is kept for **reference and learning purposes only**.

![Screenshot 2024-09-03 at 19 04 12](https://github.com/user-attachments/assets/fbfa7567-799e-4415-b37d-0a82fa96fbc7)

---

## 📌 Status: Archived Reference

This mock server was the **original backend** for the eBookStore/CodeBook project during early development. It has been **replaced** by a serverless architecture using:

- **AWS Lambda Functions** - Serverless API endpoints
- **AWS DynamoDB** - NoSQL database
- **AWS API Gateway** - HTTP API routing
- **JWT Authentication** - Custom authentication system

**Current Backend Location:** `codebook/aws-lambda/`  
**Current Backend Documentation:** See `codebook/aws-lambda/README.md`

This archived reference is maintained for:

- **Learning purposes** - Understanding mock server patterns
- **Reference** - Comparing old vs new architecture
- **Educational value** - Demonstrating different backend approaches

---

## Project Summary

The **eBookStore Mock Server** is a backend mock API server built with **Express**, **json-server**, and **json-server-auth** to simulate the eBookStore application's backend. It provides a fully functional REST API for products, featured products, orders, and users, complete with authentication and custom access rules. This project is ideal for frontend/backend developers and learners who wish to understand API mockups, authentication, and rapid prototyping.

**Note:** This was the original backend implementation. The current CodeBook project uses AWS Lambda instead.

- **Backend Demo:** [https://codebook-mock-server-j8n3.onrender.com](https://codebook-mock-server-j8n3.onrender.com) (may be offline)
- **Frontend Demo:** [https://ebookstore-arnob.netlify.app](https://ebookstore-arnob.netlify.app)
- **Frontend Source:** [https://github.com/arnobt78/eBookStore--ReactJS](https://github.com/arnobt78/eBookStore--ReactJS)

---

## Table of Contents

1. [Status: Archived Reference](#-status-archived-reference)
2. [Project Summary](#project-summary)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [Installation](#installation)
7. [How to Run](#how-to-run)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Access](#authentication--access)
10. [Example Data & Scripts](#example-data--scripts)
11. [Learning & Teaching Notes](#learning--teaching-notes)
12. [Architecture Comparison](#architecture-comparison)
13. [Conclusion](#conclusion)

---

## Project Structure

```bash
.
├── .gitignore
├── data/
│   ├── db.json
│   └── routes.json
├── index.js
├── package.json
```

- **.gitignore**: Specifies files/folders to ignore in Git.
- **data/db.json**: Stores mock data for products, featured products, orders, and users.
- **data/routes.json**: Custom route rules for the API.
- **index.js**: Main entry point; configures and starts the Express server, JSON server, and authentication.
- **package.json**: Project metadata, dependencies, and scripts.

View the project files directly for more details:

- [db.json](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/data/db.json)
- [routes.json](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/data/routes.json)
- [index.js](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/index.js)
- [package.json](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/package.json)

---

## Features

- **Full REST API** for eBookStore entities (products, featured_products, orders, users)
- **Authentication & Authorization** using `json-server-auth` (configurable access levels)
- **Custom Routing** via `routes.json`
- **CORS** enabled for easy frontend integration
- **Mock Data** for learning, prototyping, and frontend development
- **Easy Extensibility** for new resources or routes

---

## Technology Stack

- **Node.js**: Server runtime
- **Express**: Core server framework
- **json-server**: Rapid REST API mock server
- **json-server-auth**: Simple authentication/authorization layer for `json-server`

---

## Installation

### Prerequisites

- Node.js installed ([Download Node.js](https://nodejs.org/))
- npm (Node Package Manager)

### Steps

1. **Clone the Repository:**

   ```sh
   git clone <repository-url>
   cd Mock-Server--eBookStore
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

---

## How to Run

Start the server with:

```sh
npm start
```

- By default, the server runs on: [http://localhost:8000](http://localhost:8000)

---

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/products` — Fetch all products
- `GET /api/featured_products` — Fetch all featured products
- `GET /api/orders` — Fetch all orders
- `GET /api/users` — Fetch all users

**Custom routes** and access rules are defined in [`data/routes.json`](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/data/routes.json):

```json
{
  "/products*": "/444/",
  "/featured_products*": "/444/",
  "/orders*": "/660/",
  "/users*": "/600/"
}
```

---

## Authentication & Access

Authentication is handled via `json-server-auth` and rules are set in `index.js`:

```javascript
const rules = auth.rewriter({
  products: 444, // Read-only
  featured_products: 444, // Read-only
  orders: 660, // Read & Write
  users: 600, // Full access
});
```

- `444` = Read-only access
- `660` = Read and write access
- `600` = Full access (CRUD)

**Authentication Example:**  
To access protected routes, you must register/login and use the provided token.

---

## Example Data & Scripts

### Example Product (`db.json`)

```json
{
  "products": [
    {
      "id": 10001,
      "name": "Basics To Advanced In React",
      "overview": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error unde quisquam magni vel eligendi nam.",
      "long_description": "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta aut, vel ipsum maxime quam quia, quaerat tempore minus odio exercitationem illum et eos, quas ipsa aperiam magnam officiis libero expedita quo voluptas deleniti sit dolore? Praesentium tempora cumque facere consectetur quia, molestiae quam, accusamus eius corrupti laudantium aliquid! Tempore laudantium unde labore voluptates repellat, dignissimos aperiam ad ipsum laborum recusandae voluptatem non dolore. Reiciendis cum quo illum. Dolorem, molestiae corporis.",
      "price": 29,
      "poster": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=650&q=40",
      "image_local": "/assets/images/10001.avif",
      "rating": 5,
      "in_stock": true,
      "size": 5,
      "best_seller": true
    }
    // More products...
  ]
}
```

> For more, see [`data/db.json`](https://github.com/arnobt78/Mock-Server--eBookStore/blob/main/data/db.json)

---

## Learning & Teaching Notes

- **Purpose:** This project is designed as a learning tool for developers to understand how to mock REST APIs, use authentication, and simulate a real backend for frontend development.
- **Modular Structure:** Easily add more entities or extend existing data.
- **Security:** Shows how to implement and test route protection in a mock server context.
- **Frontend Integration:** Works perfectly with any frontend (React, Angular, Vue, etc.) — just use the `/api` endpoints.
- **Customization:** Data, routes, and access rules can be easily edited for different scenarios.

---

## Architecture Comparison

### Old Architecture (This Reference - Archived)

```bash
Frontend (React)
    ↓
Express + json-server + json-server-auth
    ↓
JSON File (db.json) - In-memory database
    ↓
Render.com / Local Server
```

**Characteristics:**

- ✅ Simple setup - just `npm start`
- ✅ Fast prototyping
- ✅ Good for learning and development
- ❌ Not scalable for production
- ❌ Data stored in JSON file (not persistent)
- ❌ Requires always-on server
- ❌ Limited authentication features

### Current Architecture (Active)

```bash
Frontend (React)
    ↓
AWS API Gateway (HTTP API)
    ↓
AWS Lambda Functions (Serverless)
    ↓
AWS DynamoDB (NoSQL Database)
```

**Characteristics:**

- ✅ Serverless - no server management
- ✅ Scalable - auto-scales with traffic
- ✅ Production-ready
- ✅ Persistent data storage (DynamoDB)
- ✅ Pay-per-use pricing
- ✅ AWS Free Tier eligible
- ✅ Advanced features (payment processing, email, shipping)

### Why the Migration?

The project migrated from this mock server to AWS Lambda for:

1. **Scalability** - Serverless architecture handles traffic spikes automatically
2. **Cost Efficiency** - Pay only for what you use (free tier available)
3. **Production Ready** - Real database, proper authentication, payment processing
4. **Feature Rich** - Support for Stripe payments, email notifications, shipping labels
5. **Maintenance** - No server management, automatic updates, high availability

### When to Use Each Approach

**Use Mock Server (This Reference):**

- Learning and prototyping
- Frontend development without backend
- Quick demos and POCs
- Teaching REST API concepts
- Local development only

**Use AWS Lambda (Current):**

- Production applications
- Scalable projects
- Real-world features (payments, emails, etc.)
- Cost-effective serverless architecture
- Enterprise-grade infrastructure

---

## Full Code Example: Server Setup (`index.js`)

```javascript
import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";

const server = express();
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const router = jsonServer.router("./data/db.json");
server.use("/api", router);
server.db = router.db;

const middlewares = jsonServer.defaults();
const rules = auth.rewriter({
  products: 444,
  featured_products: 444,
  orders: 660,
  users: 600,
});

server.use(rules);
server.use(auth);
server.use(middlewares);
server.use(router);

server.listen(8000);
```

---

## Keywords

`express`, `json-server`, `mock api`, `authentication`, `json-server-auth`, `REST`, `node.js`, `eBookStore`, `api prototyping`, `learning`, `teaching`, `backend`, `routes`, `middleware`, `mock data`, `CORS`

---

## Conclusion

The **eBookStore Mock Server** is a robust and easy-to-use mock backend for learning, teaching, and rapid prototyping. With real-world structure and authentication, it empowers developers to quickly test and demo frontend applications without building a full backend. Customize the data, routes, and rules as needed — and start building today!

**Note:** While this mock server is archived and no longer used in the active CodeBook project, it remains a valuable reference for understanding:

- Mock API server patterns
- Express.js and json-server usage
- Authentication with json-server-auth
- Rapid prototyping techniques
- Backend architecture evolution

For the current production backend, see `codebook/aws-lambda/README.md`.

---
