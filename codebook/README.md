# CodeBook – Modern Computer Science eBook Store - React, Express E-Commerce Website

![Screenshot 2024-09-03 at 19 04 34](https://github.com/user-attachments/assets/a1701da8-19dc-4493-b02d-f2cb4e37feea) ![Screenshot 2024-09-03 at 19 04 50](https://github.com/user-attachments/assets/580eb690-e02b-4123-be4f-7c6b82bb4985) ![Screenshot 2024-09-03 at 19 05 04](https://github.com/user-attachments/assets/695f1bd5-3d8f-4049-9a11-f3f3a7805fda) ![Screenshot 2024-09-03 at 19 05 24](https://github.com/user-attachments/assets/25cf13dc-84c3-46f7-a9f9-9449da72123a) ![Screenshot 2024-09-03 at 19 06 17](https://github.com/user-attachments/assets/f35ea3d3-43ba-4114-8508-fb6509af8232) ![Screenshot 2024-09-03 at 19 07 19](https://github.com/user-attachments/assets/b8d5f055-7719-47d7-901c-f86b7b7f78f5) ![Screenshot 2024-09-03 at 19 07 42](https://github.com/user-attachments/assets/64583a22-c1b6-42e3-b459-d9c95002b2af) ![Screenshot 2024-09-03 at 19 07 52](https://github.com/user-attachments/assets/8772d23c-f95f-454d-957f-16d98936cf32) ![Screenshot 2024-09-03 at 19 08 45](https://github.com/user-attachments/assets/5e1a348b-f873-463d-9e8c-27e4f1e12aff) ![Screenshot 2024-09-03 at 19 09 19](https://github.com/user-attachments/assets/2dafa0c2-451a-4333-99a8-0167d9493df4) ![Screenshot 2024-09-03 at 19 09 29](https://github.com/user-attachments/assets/7a565cef-3caf-4295-b1b0-b3cc35086276) ![Screenshot 2024-09-03 at 19 09 43](https://github.com/user-attachments/assets/26854077-9177-40c6-9337-3bb3ec0ebd19) ![Screenshot 2024-09-03 at 19 10 10](https://github.com/user-attachments/assets/006d3b5b-a967-4dd6-9dee-2bf662c4d6c2)

---

CodeBook is a full-featured, modern eBook store built with React, designed for computer science learners and developers. It demonstrates best practices in React, global state management, authentication, RESTful API integration, and responsive UI with Tailwind CSS. The project is ideal for learning, teaching, and real-world deployment (Netlify & Render). Users can browse, search, and order the latest codebooks and e-books, with a seamless frontend and a mock backend.

- **Frontend-Live:** [https://ebookstore-arnob.netlify.app](https://ebookstore-arnob.netlify.app)
- **Backend-Live:** [https://codebook-mock-server-j8n3.onrender.com](https://codebook-mock-server-j8n3.onrender.com)
- **Backend-Source:** [eBookStore-Mock-Server Repo](https://github.com/arnobt78/eBookStore-Mock-Server)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Live Demo](#live-demo)
4. [Project Structure](#project-structure)
5. [Technology Stack](#technology-stack)
6. [Installation & Setup](#installation--setup)
7. [Usage & Walkthrough](#usage--walkthrough)
8. [Component & API Reference](#component--api-reference)
9. [Routing & Navigation](#routing--navigation)
10. [Customization & Reuse](#customization--reuse)
11. [Keywords](#keywords)
12. [Conclusion](#conclusion)

---

## Project Overview

CodeBook is a scalable, modular React e-commerce site for codebooks and eBooks. It features JWT-based authentication, protected routes, persistent cart, and a robust API layer. The backend is a mock server (JSON Server + Auth), making it easy to run locally or deploy.

---

## Key Features

- Modern React with Hooks & Context API
- Shopping Cart Functionality
- User Authentication (JWT)
- RESTful API Integration
- React Router v6 for Navigation
- Responsive UI with Tailwind CSS
- Global Loading Spinner (UX)
- Error Handling & Toast Notifications
- Modular Components & Custom Hooks
- Ready for Netlify (Frontend) & Render (Backend) Deployment

---

## Live Demo

- **Frontend:** <https://ebookstore-arnob.netlify.app>
- **Backend:** <https://codebook-mock-server-j8n3.onrender.com>
- **Author Portfolio:** <https://arnob-mahmud.vercel.app/>

---

## Project Structure

```bash
codebook/
├── data/                  # Mock database & routes config
├── public/                # Static assets and index.html
├── src/                   # Main React source code
│   ├── components/        # Reusable and page components
│   ├── context/           # Global state (Context API, Providers)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page-level components
│   ├── reducers/          # Reducers for state management
│   ├── routes/            # Routing components
│   ├── services/          # API and data services
│   ├── App.js             # Root component & routing
│   ├── index.js           # Entry point
│   └── ...other files
├── package.json           # Project metadata & dependencies
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # Documentation (this file)
```

---

## Technology Stack

- **Frontend:** React, React Router, Context API, Tailwind CSS
- **Backend:** JSON Server, JSON Server Auth (Mock REST API)
- **Testing:** React Testing Library, Jest
- **Deployment:** Netlify (Frontend), Render (Backend)
- **Utilities:** dotenv, JWT, Fetch API, React Toastify

---

## Installation & Setup

### Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/arnobt78/eBookStore--React.git
cd eBookStore--React

# Install dependencies
npm install

# Start the development server
npm start
# Visit http://localhost:3000
```

### Backend Setup (Mock Server)

```bash
# Install JSON Server and Auth
npm install -D json-server json-server-auth

# Run JSON Server
npx json-server data/db.json

# Run Auth Server (in a second terminal)
npx json-server data/db.json -m ./node_modules/json-server-auth -r data/routes.json --port 8000
```

### Environment Variables

Create a `.env` file in your root project directory:

```env
REACT_APP_HOST=http://localhost:8000
REACT_APP_GUEST_LOGIN=test@example.com
REACT_APP_GUEST_PASSWORD=12345678
```

---

## Usage & Walkthrough

### Main Functionalities

- **Browse & Search:** Explore eBooks, filter by best seller, in stock, price, etc.
- **Product Detail:** View detailed info, add/remove from cart.
- **Cart:** Persistent cart, checkout, and order summary.
- **Authentication:** Register, login, JWT-protected routes.
- **Dashboard:** View your orders (protected route).
- **Global Loading Spinner:** Shows while fetching data.
- **Error Handling:** Toast notifications for errors.

### Example: Using a Component

```jsx
import { ProductCard } from "./components";

<ProductCard product={product} />;
```

### Example: Fetching Products

```js
import { getProductList } from "./services";
const products = await getProductList("searchTerm");
```

---

## Component & API Reference

### Main Components

- `Header`, `Footer`, `ProductCard`, `Rating`, `DropdownLoggedIn`, `DropdownLoggedOut`, `ScrollToTop`, `LoadingSpinner`
- **Pages:** Home, Products, Product Detail, Cart, Order, Dashboard, Login, Register, PageNotFound

### Context & State

- `CartContext`, `FilterContext`, `LoadingContext` for global state
- Reducers for cart and filter logic

### API Services

- `getProductList`, `getProduct`, `getFeaturedList`, `getUser`, `getUserOrders`, `createOrder`, `login`, `register`, `logout`

---

## Routing & Navigation

Routes are defined in `src/routes/AllRoutes.js`:

- `/` — Home
- `/products` — Product listing
- `/products/:id` — Product detail
- `/cart` — Cart (protected)
- `/order-summary` — Order summary (protected)
- `/dashboard` — User dashboard (protected)
- `/login` — Login
- `/register` — Register
- `*` — 404 Page Not Found

Protected routes use the `ProtectedRoute` component and require authentication.

---

## Customization & Reuse

- **Component Reuse:** All UI components are modular and can be imported into other projects.
- **API Layer:** Easily adapt the API services for your own backend.
- **Styling:** Tailwind CSS makes it easy to customize the look and feel.
- **State Management:** Context and reducers are reusable for other React apps.

---

## Keywords

`React`, `E-Commerce`, `Mock Server`, `JWT Auth`, `React Router`, `Tailwind CSS`, `Full Stack`, `Netlify`, `Render`, `Learning Project`, `REST API`, `Codebooks`, `Global State`, `Context API`, `Shopping Cart`, `Modern Web`, `Reusable Components`, `Teaching`, `Open Source`

---

## Conclusion

CodeBook is not just a project—it's a learning journey. It combines real-world tech stacks, best practices, and deployment workflows, making it perfect for both beginners and intermediate developers keen to master modern React and full-stack development. Fork, clone, and start coding!

---

## Happy Coding! 🎉

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
