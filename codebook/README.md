# CodeBook – Modern Computer Science eBook Store

![Screenshot 2024-09-03 at 19 04 34](https://github.com/user-attachments/assets/a1701da8-19dc-4493-b02d-f2cb4e37feea) ![Screenshot 2024-09-03 at 19 04 50](https://github.com/user-attachments/assets/580eb690-e02b-4123-be4f-7c6b82bb4985) ![Screenshot 2024-09-03 at 19 05 04](https://github.com/user-attachments/assets/695f1bd5-3d8f-4049-9a11-f3f3a7805fda) ![Screenshot 2024-09-03 at 19 05 24](https://github.com/user-attachments/assets/25cf13dc-84c3-46f7-a9f9-9449da72123a) ![Screenshot 2024-09-03 at 19 06 17](https://github.com/user-attachments/assets/f35ea3d3-43ba-4114-8508-fb6509af8232) ![Screenshot 2024-09-03 at 19 07 19](https://github.com/user-attachments/assets/b8d5f055-7719-47d7-901c-f86b7b7f78f5) ![Screenshot 2024-09-03 at 19 07 42](https://github.com/user-attachments/assets/64583a22-c1b6-42e3-b459-d9c95002b2af) ![Screenshot 2024-09-03 at 19 07 52](https://github.com/user-attachments/assets/8772d23c-f95f-454d-957f-16d98936cf32) ![Screenshot 2024-09-03 at 19 08 45](https://github.com/user-attachments/assets/5e1a348b-f873-463d-9e8c-27e4f1e12aff) ![Screenshot 2024-09-03 at 19 09 19](https://github.com/user-attachments/assets/2dafa0c2-451a-4333-99a8-0167d9493df4) ![Screenshot 2024-09-03 at 19 09 29](https://github.com/user-attachments/assets/7a565cef-3caf-4295-b1b0-b3cc35086276) ![Screenshot 2024-09-03 at 19 09 43](https://github.com/user-attachments/assets/26854077-9177-40c6-9337-3bb3ec0ebd19) ![Screenshot 2024-09-03 at 19 10 10](https://github.com/user-attachments/assets/006d3b5b-a967-4dd6-9dee-2bf662c4d6c2)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Running the Project](#running-the-project)
8. [Project Architecture](#project-architecture)
9. [Routes & Navigation](#routes--navigation)
10. [Components Guide](#components-guide)
11. [API Services & Endpoints](#api-services--endpoints)
12. [State Management](#state-management)
13. [Custom Hooks](#custom-hooks)
14. [Code Examples](#code-examples)
15. [Reusing Components](#reusing-components)
16. [Keywords](#keywords)
17. [Conclusion](#conclusion)

---

## Project Overview

**CodeBook** is a full-featured, production-ready e-commerce platform for selling computer science eBooks. Built with modern React practices, it demonstrates real-world application architecture with authentication, payment processing, admin dashboard, analytics, and comprehensive order management.

The project showcases:

- **Modern React Patterns**: Hooks, Context API, React Query for state management
- **Serverless Backend**: AWS Lambda functions with HTTP API Gateway
- **Database**: AWS DynamoDB for scalable data storage
- **Payment Integration**: Stripe for secure payment processing
- **Image Management**: Cloudinary for optimized image uploads
- **Email Notifications**: Brevo for transactional emails
- **Shipping Integration**: Shippo API for shipping label generation
- **Responsive Design**: Tailwind CSS with dark mode support
- **UI Components**: ShadCN UI for consistent, accessible components

---

## Key Features

### Customer Features

✅ **Product Browsing & Search**

- Browse all products with search functionality
- Filter by best sellers, in-stock items, price range
- Featured products section on homepage
- Product detail pages with ratings, reviews, and QR codes

✅ **Shopping Cart**

- Persistent cart with quantity management
- Stock validation (prevents adding out-of-stock items)
- User-specific cart isolation (clears on logout/login)
- Real-time price calculations

✅ **Authentication & User Management**

- User registration and login with JWT tokens
- Protected routes for authenticated users
- Session management with automatic token refresh
- Role-based access control (User/Admin)

✅ **Order Management**

- Secure checkout with Stripe Payment Element
- Order history dashboard
- Order tracking with shipping information
- Payment confirmation pages

✅ **Product Reviews**

- Customers can review products they've purchased
- 5-star rating system
- Review display on product pages
- Review moderation by admins

✅ **Support Tickets**

- Create and manage support tickets
- Real-time ticket status updates
- Email notifications for ticket responses
- Ticket history tracking

### Admin Features

✅ **Dashboard & Analytics**

- Business insights with revenue charts
- Sales trends analysis
- Top-selling products tracking
- User analytics and registration trends
- Export functionality (CSV/PDF)

✅ **Product Management**

- Full CRUD operations (Create, Read, Update, Delete)
- Image upload with Cloudinary
- Featured products management (max 3)
- Stock management with low stock alerts
- QR code generation for products

✅ **Order Management**

- View all orders with search and filters
- Update order status
- Process refunds via Stripe
- Generate shipping labels (Shippo API)
- Manual tracking number entry
- Order detail pages with full information

✅ **User Management**

- View all users
- Edit user information
- Delete users (with demo account protection)
- User detail pages

✅ **Review Management**

- Moderate product reviews
- Approve/reject reviews
- Edit or delete reviews
- Review analytics

✅ **Activity Logging**

- Comprehensive activity tracking
- Search and filter activity logs
- User-friendly field name display
- Real-time updates

✅ **Notifications System**

- Real-time notification counts
- Role-based notifications
- Mark as read functionality
- Smart redirects based on notification type

---

## Technology Stack

### Frontend

- **React 19.2.0** - Modern UI library
- **React Router DOM 7.9.6** - Client-side routing
- **TanStack React Query 5.90.10** - Server state management and caching
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library
- **Recharts 3.5.1** - Chart library for analytics
- **React Toastify 11.0.5** - Toast notifications
- **React Dropzone 14.3.8** - File upload component
- **QRCode React 4.2.0** - QR code generation

### Backend

- **AWS Lambda** - Serverless functions (Node.js 22.x)
- **AWS HTTP API Gateway** - RESTful API endpoints
- **AWS DynamoDB** - NoSQL database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### Third-Party Services

- **Stripe** - Payment processing
- **Cloudinary** - Image storage and optimization
- **Brevo** - Email service
- **Shippo** - Shipping label generation

### Development Tools

- **React Scripts 5.0.1** - Build tooling
- **PostCSS** - CSS processing
- **ESLint** - Code linting

---

## Project Structure

```bash
codebook/
├── public/                    # Static assets
│   ├── assets/images/        # Product images
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Elements/         # Core UI elements
│   │   │   ├── ProductCard.js
│   │   │   ├── Rating.js
│   │   │   ├── ReviewCard.js
│   │   │   └── ...
│   │   ├── Layouts/          # Layout components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── Admin/        # Admin layout components
│   │   ├── ui/               # ShadCN UI components
│   │   │   ├── card.js
│   │   │   ├── button.js
│   │   │   ├── SortableTable.js
│   │   │   └── ...
│   │   └── Sections/         # Page sections
│   │
│   ├── pages/                # Page components
│   │   ├── Home/             # Homepage
│   │   ├── Products/         # Product listing
│   │   ├── Cart/             # Shopping cart
│   │   ├── Dashboard/        # User dashboard
│   │   ├── Admin/            # Admin pages
│   │   ├── Tickets/          # Support tickets
│   │   └── Payment/          # Payment pages
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useProducts.js
│   │   ├── useUser.js
│   │   ├── useAdmin.js
│   │   └── ...
│   │
│   ├── services/             # API service functions
│   │   ├── productService.js
│   │   ├── authService.js
│   │   ├── adminService.js
│   │   └── ...
│   │
│   ├── context/              # React Context providers
│   │   ├── CartContext.js
│   │   ├── FilterContext.js
│   │   └── LoadingContext.js
│   │
│   ├── routes/               # Route definitions
│   │   ├── AllRoutes.js
│   │   └── ProtectedRoute.js
│   │
│   ├── reducers/             # Redux-style reducers
│   │   ├── cartReducers.js
│   │   └── filterReducers.js
│   │
│   ├── utils/                # Utility functions
│   │   ├── formatDate.js
│   │   ├── formatPrice.js
│   │   └── queryInvalidation.js
│   │
│   ├── App.js                # Root component
│   └── index.js              # Entry point
│
├── aws-lambda/               # AWS Lambda functions
│   ├── functions/            # Individual Lambda handlers
│   ├── shared/               # Shared utilities
│   ├── template.yaml         # SAM template
│   └── deploy.sh             # Deployment script
│
├── scripts/                  # Utility scripts
├── .env                      # Environment variables
├── package.json              # Dependencies
└── tailwind.config.js        # Tailwind configuration
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+ (recommended: v20+)
- **npm** (comes with Node.js)
- **Git** for cloning the repository
- **AWS Account** (for backend deployment)
- **Stripe Account** (for payment processing)
- **Cloudinary Account** (for image uploads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/codebook-ecommerce.git
cd codebook-ecommerce/codebook
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including React, React Router, React Query, Tailwind CSS, and other dependencies.

### Step 3: Set Up Environment Variables

Create a `.env` file in the `codebook/` directory (see [Environment Variables](#environment-variables) section below).

### Step 4: Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000` (or next available port).

---

## Environment Variables

Create a `.env` file in the `codebook/` directory with the following variables:

### Required Variables

```bash
# AWS Lambda HTTP API URL (Backend API)
REACT_APP_LAMBDA_API_URL=https://your-api-id.execute-api.region.amazonaws.com

# Stripe Public Key (Safe to expose in frontend)
REACT_APP_STRIPE_PUB_KEY=pk_test_...

# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
REACT_APP_IMAGE_SERVICE=cloudinary

# Base URL (for QR codes and links)
REACT_APP_BASE_URL=http://localhost:3000
# In production: REACT_APP_BASE_URL=https://your-domain.com
```

### Optional Variables (for Testing)

```bash
# Guest Login Credentials (for testing)
REACT_APP_GUEST_LOGIN=test@example.com
REACT_APP_GUEST_PASSWORD=12345678

# Admin Login Credentials (for testing)
REACT_APP_ADMIN_LOGIN=admin@example.com
REACT_APP_ADMIN_PASSWORD=12345678
```

### How to Get These Values

1. **REACT_APP_LAMBDA_API_URL**:

   - Deploy AWS Lambda functions (see `aws-lambda/README.md`)
   - Copy the API Gateway endpoint URL from AWS Console

2. **REACT_APP_STRIPE_PUB_KEY**:

   - Sign up at [Stripe](https://stripe.com)
   - Get your test public key from Dashboard → Developers → API keys

3. **REACT_APP_CLOUDINARY_CLOUD_NAME**:

   - Sign up at [Cloudinary](https://cloudinary.com)
   - Get your cloud name from Dashboard

4. **REACT_APP_CLOUDINARY_UPLOAD_PRESET**:

   - In Cloudinary Dashboard → Settings → Upload
   - Create an unsigned upload preset
   - Use the preset name

5. **REACT_APP_BASE_URL**:
   - Local development: `http://localhost:3000`
   - Production: Your deployed frontend URL (e.g., `https://your-app.vercel.app`)

### Important Notes

- **Never commit `.env` file to Git** - It's already in `.gitignore`
- **Use `.env.example`** as a template (if available)
- **For production**: Set these variables in your hosting platform (Vercel, Netlify, etc.)
- **Stripe Secret Key**: Should NEVER be in frontend `.env` - Only in Lambda environment variables

---

## Running the Project

### Development Mode

```bash
npm start
```

- Starts React development server
- Opens browser automatically
- Hot reload enabled (changes reflect immediately)
- Runs on `http://localhost:3000` (or next available port)

### Production Build

```bash
npm run build
```

- Creates optimized production build in `build/` directory
- Minifies JavaScript and CSS
- Optimizes images
- Ready for deployment

### Testing

```bash
npm test
```

- Runs test suite using Jest and React Testing Library
- Watch mode enabled by default

### Custom Development Script

```bash
npm run dev
```

- Uses custom port detection script
- Automatically finds available port if 3000 is busy

---

## Project Architecture

### Frontend Architecture

```bash
┌─────────────────────────────────────────┐
│         React Application                │
│  (index.js → App.js → Routes)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Context Providers                   │
│  - QueryClientProvider (React Query)    │
│  - CartProvider (Cart State)            │
│  - FilterProvider (Filter State)        │
│  - LoadingProvider (Loading State)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Page Components                     │
│  - HomePage, ProductsList, CartPage     │
│  - AdminDashboardPage, etc.             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Custom Hooks                        │
│  - useProducts, useUser, useAdmin       │
│  - usePayment, useReviews, etc.         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Service Layer                       │
│  - productService.js                    │
│  - authService.js                       │
│  - adminService.js                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      AWS Lambda HTTP API                 │
│  (Backend Functions)                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      AWS DynamoDB                        │
│  (Database)                              │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → Component calls custom hook
2. **Custom Hook** → Uses React Query to fetch/update data
3. **React Query** → Calls service function
4. **Service Function** → Makes HTTP request to Lambda API
5. **Lambda Function** → Processes request, queries DynamoDB
6. **Response** → Flows back through the chain
7. **UI Update** → React Query updates cache, components re-render

---

## Routes & Navigation

All routes are defined in `src/routes/AllRoutes.js`. The application uses React Router DOM for client-side routing.

### Public Routes

```javascript
/                           # Homepage
/products                   # Product listing page
/products/:id               # Product detail page
/login                      # User login
/register                   # User registration
```

### Protected Routes (Require Authentication)

```javascript
/cart                       # Shopping cart
/dashboard                  # User order dashboard
/order-summary              # Order summary page
/payment-success            # Payment success page
/payment-cancel             # Payment cancellation page
/tickets                    # Support tickets list
/tickets/create             # Create new ticket
/tickets/:ticketId          # Ticket detail page
```

### Admin Routes (Require Admin Role)

```javascript
/admin                      # Admin dashboard
/admin/products             # Product management
/admin/products/new         # Create new product
/admin/products/:id         # Product detail (admin view)
/admin/products/:id/edit    # Edit product
/admin/orders               # Order management
/admin/orders/:id           # Order detail
/admin/users                # User management
/admin/users/:id            # User detail
/admin/users/:id/edit       # Edit user
/admin/business-insights     # Analytics dashboard
/admin/management-history   # Activity logs
/admin/tickets              # Admin tickets view
/admin/tickets/:ticketId    # Ticket detail (admin)
/admin/reviews              # Review management
```

### Route Protection

Routes are protected using the `ProtectedRoute` component:

```javascript
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>
```

**How it works:**

- Checks for authentication token in sessionStorage
- Verifies user role (for admin routes)
- Redirects to login if not authenticated
- Shows loading state during verification

---

## Components Guide

### Layout Components

#### Header Component

**Location**: `src/components/Layouts/Header.js`

**Purpose**: Main navigation header with logo, search, and user menu

**Features**:

- Responsive design (mobile/desktop)
- Search functionality
- User dropdown (logged in/out states)
- Notification badge
- Dark mode support

**Usage**:

```javascript
import { Header } from "./components";

function App() {
  return (
    <>
      <Header />
      {/* Your content */}
    </>
  );
}
```

#### Footer Component

**Location**: `src/components/Layouts/Footer.js`

**Purpose**: Site footer with links and information

**Usage**:

```javascript
import { Footer } from "./components";

function App() {
  return (
    <>
      {/* Your content */}
      <Footer />
    </>
  );
}
```

#### AdminLayout Component

**Location**: `src/components/Layouts/Admin/AdminLayout.js`

**Purpose**: Layout wrapper for admin pages with sidebar and header

**Features**:

- Collapsible sidebar
- Admin header with notifications
- Responsive design
- Active route highlighting

**Usage**:

```javascript
import { AdminLayout } from "./components/Layouts/Admin";

function AdminProductsPage() {
  return <AdminLayout>{/* Admin page content */}</AdminLayout>;
}
```

### UI Elements

#### ProductCard Component

**Location**: `src/components/Elements/ProductCard.js`

**Purpose**: Displays product information in a card format

**Props**:

```javascript
{
  product: {
    id: string;
    name: string;
    overview: string;
    price: number;
    rating: number;
    best_seller: boolean;
    in_stock: boolean;
    // ... other product fields
  }
}
```

**Features**:

- Product image with fallback
- Best seller badge
- Rating display
- Add to cart button
- Link to product detail page
- Stock status indication

**Usage**:

```javascript
import { ProductCard } from "./components";

function ProductsList() {
  const { data: products } = useProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Reusing in Other Projects**:

- Copy `ProductCard.js` to your project
- Install required dependencies (react-router-dom, Rating component)
- Adapt styling to match your design system
- Modify props structure if needed

#### Rating Component

**Location**: `src/components/Elements/Rating.js`

**Purpose**: Displays star rating (1-5 stars)

**Props**:

```javascript
{
  rating: number;        // 1-5
  className?: string;    // Optional CSS classes
}
```

**Usage**:

```javascript
import { Rating } from "./components";

<ProductCard>
  <Rating rating={4.5} />
</ProductCard>;
```

#### Card Component (ShadCN UI)

**Location**: `src/components/ui/card.js`

**Purpose**: Reusable card container with header support

**Props**:

```javascript
{
  children: ReactNode;        // Card content
  className?: string;         // Additional CSS classes
  header?: string;            // Optional header text
  headerAction?: ReactNode;   // Optional action button
  onClick?: Function;         // Optional click handler
}
```

**Usage**:

```javascript
import { Card } from "./components/ui";

<Card header="Product Information" headerAction={<Button>Edit</Button>}>
  <p>Product details here</p>
</Card>;
```

#### StatusBadge Component

**Location**: `src/components/ui/status-badge.js`

**Purpose**: Displays status with color coding

**Props**:

```javascript
{
  status: string;        // "pending" | "shipped" | "delivered" | etc.
  className?: string;    // Optional CSS classes
}
```

**Usage**:

```javascript
import { StatusBadge } from "./components/ui";

<StatusBadge status="shipped" />;
```

#### SortableTable Component

**Location**: `src/components/ui/SortableTable.js`

**Purpose**: Table with sorting functionality

**Props**:

```javascript
{
  data: Array;                    // Table data
  columns: Array;                 // Column definitions
  defaultSort?: {                  // Default sort configuration
    key: string;
    direction: "asc" | "desc";
  };
  className?: string;              // Optional CSS classes
  headerClassName?: string;       // Optional header CSS classes
}
```

**Usage**:

```javascript
import { SortableTable } from "./components/ui";

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "stock", label: "Stock", sortable: false },
];

<SortableTable
  data={products}
  columns={columns}
  defaultSort={{ key: "name", direction: "asc" }}
/>;
```

### Form Components

#### FormInput Component

**Location**: `src/components/ui/form-input.js`

**Purpose**: Styled input field with label and error support

**Usage**:

```javascript
import { FormInput, FormLabel, FormError } from "./components/ui";

<FormLabel htmlFor="name">Product Name</FormLabel>
<FormInput
  id="name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<FormError message={errors.name} />
```

#### FormSelect Component

**Location**: `src/components/ui/form-select.js`

**Purpose**: Styled select dropdown

**Usage**:

```javascript
import { FormSelect, FormLabel } from "./components/ui";

<FormLabel htmlFor="status">Status</FormLabel>
<FormSelect
  id="status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="pending">Pending</option>
  <option value="shipped">Shipped</option>
  <option value="delivered">Delivered</option>
</FormSelect>
```

#### ImageUpload Component

**Location**: `src/components/ui/image-upload.js`

**Purpose**: Drag-and-drop image upload with Cloudinary integration

**Features**:

- Drag and drop support
- Click to upload
- Image preview
- Remove image functionality
- Automatic Cloudinary upload

**Usage**:

```javascript
import { ImageUpload } from "./components/ui";
import { useImageUpload } from "../hooks/useImageUpload";

function ProductForm() {
  const { imageUrl, handleImageUpload, removeImage } = useImageUpload();

  return (
    <ImageUpload
      imageUrl={imageUrl}
      onImageUpload={handleImageUpload}
      onRemove={removeImage}
      label="Product Image"
    />
  );
}
```

---

## API Services & Endpoints

All API calls are made through service functions in `src/services/`. These functions make HTTP requests to AWS Lambda endpoints.

### Product Services

**File**: `src/services/productService.js`

```javascript
// Get all products (with optional search)
getProductList(searchTerm);

// Get single product by ID
getProduct(id);

// Get featured products (filters from products list)
getFeaturedList();
```

**Example Usage**:

```javascript
import { getProductList, getProduct } from "./services/productService";

// Fetch all products
const products = await getProductList("");

// Search products
const searchResults = await getProductList("python");

// Get single product
const product = await getProduct("product-id-123");
```

### Authentication Services

**File**: `src/services/authService.js`

```javascript
// Login user
login({ email, password });

// Register new user
register({ email, password, name });

// Logout user (clears session)
logout();
```

**Example Usage**:

```javascript
import { login, register, logout } from "./services/authService";

// Login
const result = await login({
  email: "user@example.com",
  password: "password123",
});
// Token is automatically stored in sessionStorage

// Register
const result = await register({
  email: "newuser@example.com",
  password: "password123",
  name: "New User",
});

// Logout
logout(); // Clears sessionStorage
```

### Admin Services

**File**: `src/services/adminService.js`

**Available Functions**:

- `getAllProducts()` - Get all products (admin view)
- `createProduct(productData)` - Create new product
- `updateProduct(productId, updates)` - Update product
- `deleteProduct(productId)` - Delete product
- `getAllOrders()` - Get all orders
- `updateOrderStatus(orderId, status)` - Update order status
- `refundOrder(orderId, refundData)` - Process refund
- `generateShippingLabel(orderId, options)` - Generate shipping label
- `addTrackingNumber(orderId, trackingNumber, carrier)` - Add manual tracking
- `getAllUsers()` - Get all users
- `updateUser(userId, updates)` - Update user
- `deleteUser(userId)` - Delete user
- `getAdminStats()` - Get dashboard statistics
- `getActivityLogs(options)` - Get activity logs

**Example Usage**:

```javascript
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./services/adminService";

// Create product
const newProduct = await createProduct({
  name: "New Book",
  price: 29.99,
  overview: "Book description",
  // ... other fields
});

// Update product
const updated = await updateProduct(productId, {
  price: 24.99,
  stock: 50,
});

// Delete product
await deleteProduct(productId);
```

### Payment Services

**File**: `src/services/paymentService.js`

```javascript
// Create payment intent
createPaymentIntent({ amount, currency, orderId });

// Verify payment
verifyPayment(paymentIntentId);
```

### Review Services

**File**: `src/services/reviewService.js`

```javascript
// Get reviews for a product
getReviewsByProduct(productId);

// Create review
createReview({ productId, rating, comment });

// Update review
updateReview(reviewId, { rating, comment });

// Delete review
deleteReview(reviewId);
```

### Ticket Services

**File**: `src/services/ticketService.js`

```javascript
// Get all tickets (filtered by user for customers)
getTickets();

// Get single ticket
getTicket(ticketId);

// Create ticket
createTicket({ subject, message, priority });

// Reply to ticket
replyToTicket(ticketId, { message });

// Update ticket status (admin only)
updateTicketStatus(ticketId, status);
```

### API Endpoint Structure

All endpoints follow RESTful conventions:

```bash
GET    /products              # List all products
GET    /products/:id          # Get single product
POST   /products              # Create product (admin)
PUT    /products/:id          # Update product (admin)
DELETE /products/:id          # Delete product (admin)

POST   /login                 # User login
POST   /register              # User registration

GET    /orders                # Get user orders
POST   /orders                # Create order
GET    /admin/orders          # Get all orders (admin)
PUT    /admin/orders/:id      # Update order (admin)

GET    /reviews/:productId    # Get product reviews
POST   /reviews               # Create review
PUT    /reviews/:id           # Update review
DELETE /reviews/:id           # Delete review

GET    /tickets               # Get user tickets
POST   /tickets               # Create ticket
GET    /tickets/:id           # Get ticket detail
POST   /tickets/:id/reply     # Reply to ticket
```

---

## State Management

The project uses multiple state management approaches:

### 1. React Query (Server State)

**Purpose**: Manages server data (products, orders, users, etc.)

**Configuration**: `src/index.js`

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Benefits**:

- Automatic caching
- Request deduplication
- Background refetching
- Loading and error states
- Optimistic updates

### 2. Context API (Client State)

**CartContext**: `src/context/CartContext.js`

Manages shopping cart state:

- Cart items list
- Total price calculation
- Add/remove/update items
- User-specific cart isolation

**Usage**:

```javascript
import { useCart } from "./context";

function ProductCard({ product }) {
  const { cartList, addToCart, removeFromCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

**FilterContext**: `src/context/FilterContext.js`

Manages product filter state (search, filters, sorting).

**LoadingContext**: `src/context/LoadingContext.js`

Manages global loading spinner state.

### 3. Reducers (Complex State Logic)

**Cart Reducer**: `src/reducers/cartReducers.js`

Handles cart state updates:

- `ADD_TO_CART` - Add product to cart
- `REMOVE_FROM_CART` - Remove product
- `UPDATE_CART_ITEM` - Update quantity
- `CLEAR_CART` - Clear all items
- `LOAD_CART` - Load cart from storage

**Filter Reducer**: `src/reducers/filterReducers.js`

Handles filter state updates:

- `SET_SEARCH` - Set search term
- `SET_FILTER` - Apply filters
- `CLEAR_FILTERS` - Reset filters

---

## Custom Hooks

Custom hooks encapsulate reusable logic and React Query queries.

### useProducts Hook

**Location**: `src/hooks/useProducts.js`

**Purpose**: Fetch products with React Query caching

**Usage**:

```javascript
import { useProducts } from "./hooks/useProducts";

function ProductsList() {
  const { data: products, isLoading, error } = useProducts("");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Features**:

- Automatic caching (staleTime: Infinity)
- Loading and error states
- Search term support
- Featured products filtering

### useUser Hook

**Location**: `src/hooks/useUser.js`

**Purpose**: Get current user information

**Usage**:

```javascript
import { useUser } from "./hooks/useUser";

function UserProfile() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

### useAdmin Hook

**Location**: `src/hooks/useAdmin.js`

**Purpose**: Admin operations (mutations for create/update/delete)

**Available Mutations**:

- `useCreateProduct()` - Create product
- `useUpdateProduct()` - Update product
- `useDeleteProduct()` - Delete product
- `useUpdateOrderStatus()` - Update order status
- `useRefundOrder()` - Process refund
- `useGenerateShippingLabel()` - Generate shipping label
- `useAddTrackingNumber()` - Add manual tracking

**Usage**:

```javascript
import { useCreateProduct } from "./hooks/useAdmin";

function ProductForm() {
  const createMutation = useCreateProduct();

  const handleSubmit = (formData) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        // Navigate or show success message
      },
      onError: (error) => {
        // Show error message
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
```

### useImageUpload Hook

**Location**: `src/hooks/useImageUpload.js`

**Purpose**: Handle image uploads to Cloudinary

**Usage**:

```javascript
import { useImageUpload } from "./hooks/useImageUpload";

function ProductForm() {
  const { imageUrl, handleImageUpload, removeImage, isUploading } =
    useImageUpload();

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Preview" />
          <button onClick={removeImage}>Remove</button>
        </div>
      )}
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
```

### useNotifications Hook

**Location**: `src/hooks/useNotifications.js`

**Purpose**: Get notification counts and mark as read

**Usage**:

```javascript
import {
  useNotificationCount,
  useMarkNotificationsRead,
} from "./hooks/useNotifications";

function NotificationBadge() {
  const { data: notificationData } = useNotificationCount();
  const markReadMutation = useMarkNotificationsRead();

  const count = notificationData?.count || 0;

  const handleClick = () => {
    markReadMutation.mutate();
    // Navigate to notifications page
  };

  return (
    <button onClick={handleClick}>
      Notifications {count > 0 && <span>{count}</span>}
    </button>
  );
}
```

---

## Code Examples

### Example 1: Product Listing Page

```javascript
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components";
import { LoadingState, ErrorState, EmptyState } from "../components/ui";

function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { data: products, isLoading, error } = useProducts(searchTerm);

  const handleSearch = (value) => {
    setSearchParams({ search: value });
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!products?.length) return <EmptyState message="No products found" />;

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Shopping Cart Page

```javascript
import { useCart } from "../context";
import { CartCard } from "./components/CartCard";
import { CartEmpty } from "./components/CartEmpty";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartList, total, clearCart } = useCart();

  if (cartList.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div>
      <h1>Shopping Cart</h1>

      <div>
        {cartList.map((item) => (
          <CartCard key={item.id} product={item} />
        ))}
      </div>

      <div>
        <p>Total: ${total.toFixed(2)}</p>
        <Link to="/order-summary">
          <button>Proceed to Checkout</button>
        </Link>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
```

### Example 3: Admin Product Management

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllProducts, useDeleteProduct } from "../hooks/useAdmin";
import { SortableTable } from "../components/ui";
import { toast } from "react-toastify";

function AdminProductsPage() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useAllProducts();
  const deleteMutation = useDeleteProduct();

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Products</h1>
        <button onClick={() => navigate("/admin/products/new")}>
          Add New Product
        </button>
      </div>

      <SortableTable
        data={products || []}
        columns={columns}
        defaultSort={{ key: "name", direction: "asc" }}
      />
    </div>
  );
}
```

### Example 4: Product Form with Image Upload

```javascript
import { useState } from "react";
import { useCreateProduct, useUpdateProduct } from "../hooks/useAdmin";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  ImageUpload,
} from "../components/ui";

function ProductForm({ productId, initialData }) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { imageUrl, handleImageUpload, removeImage } = useImageUpload(
    initialData?.poster
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    overview: initialData?.overview || "",
    // ... other fields
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      poster: imageUrl,
    };

    if (productId) {
      updateMutation.mutate({ productId, updates: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel htmlFor="name">Product Name</FormLabel>
      <FormInput
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <FormLabel htmlFor="price">Price</FormLabel>
      <FormInput
        id="price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        required
      />

      <FormLabel htmlFor="overview">Description</FormLabel>
      <FormTextarea
        id="overview"
        value={formData.overview}
        onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
        required
      />

      <ImageUpload
        imageUrl={imageUrl}
        onImageUpload={handleImageUpload}
        onRemove={removeImage}
        label="Product Image"
      />

      <button
        type="submit"
        disabled={createMutation.isPending || updateMutation.isPending}
      >
        {productId ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
```

### Example 5: Payment Integration with Stripe

```javascript
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "../hooks/usePayment";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

function CheckoutPage() {
  const { cartList, total } = useCart();
  const createIntentMutation = useCreatePaymentIntent();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create payment intent when component mounts
    createIntentMutation.mutate(
      {
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
      },
      {
        onSuccess: (data) => {
          setClientSecret(data.clientSecret);
        },
      }
    );
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      <p>Total: ${total.toFixed(2)}</p>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      )}
    </div>
  );
}
```

---

## Reusing Components

### How to Reuse Components in Other Projects

#### Step 1: Copy Component Files

Copy the component file(s) you want to reuse:

```bash
# Example: Copy ProductCard component
cp src/components/Elements/ProductCard.js /path/to/your/project/src/components/
```

#### Step 2: Install Required Dependencies

Check the component's imports and install necessary packages:

```bash
npm install react-router-dom  # For Link component
npm install tailwindcss       # For styling
```

#### Step 3: Adapt the Component

1. **Update Imports**: Adjust import paths to match your project structure
2. **Modify Styling**: Update Tailwind classes or CSS to match your design
3. **Adjust Props**: Modify prop structure if your data model differs
4. **Remove Dependencies**: Remove any project-specific dependencies

**Example - Adapting ProductCard**:

```javascript
// Original
import { useCart } from "../../context";
import { Rating } from "./Rating";

// Adapted for your project
import { useCart } from "../context/CartContext"; // Adjust path
import { Rating } from "../components/Rating"; // Adjust path
```

#### Step 4: Copy Related Components

If the component depends on other components, copy those too:

```javascript
// ProductCard uses Rating component
// So copy both:
-ProductCard.js - Rating.js;
```

#### Step 5: Copy Utility Functions

If the component uses utility functions, copy those:

```javascript
// ProductCard uses getProductImageUrl
// Copy the utility:
-utils / productImage.js;
```

### Reusable Component Checklist

When reusing a component, ensure you have:

- ✅ Component file itself
- ✅ All imported components
- ✅ All imported utilities
- ✅ Required dependencies installed
- ✅ Styling framework (Tailwind CSS) configured
- ✅ Context providers (if component uses Context API)
- ✅ Updated import paths

### Example: Reusing Card Component

The `Card` component from `src/components/ui/card.js` is highly reusable:

**What it provides**:

- Flexible card container
- Header with optional action button
- Consistent padding and styling
- Dark mode support

**How to reuse**:

1. Copy `card.js` to your project
2. Install Tailwind CSS (if not already installed)
3. Use it directly:

```javascript
import { Card } from "./components/ui/card";

function MyComponent() {
  return (
    <Card header="My Card" headerAction={<Button>Action</Button>}>
      <p>Card content here</p>
    </Card>
  );
}
```

**No other dependencies needed!** The Card component is self-contained.

---

## Keywords

`React`, `E-Commerce`, `AWS Lambda`, `DynamoDB`, `JWT Auth`, `React Router`, `Tailwind CSS`, `React Query`, `TanStack Query`, `Stripe`, `Payment Processing`, `Cloudinary`, `Image Upload`, `ShadCN UI`, `Full Stack`, `Serverless`, `Vercel`, `Production Ready`, `Admin Dashboard`, `Analytics`, `Charts`, `Recharts`, `Order Management`, `User Management`, `Product Management`, `Shopping Cart`, `State Management`, `Context API`, `Custom Hooks`, `Responsive Design`, `Dark Mode`, `Email Notifications`, `Brevo`, `Shipping Labels`, `Shippo`, `Support Tickets`, `Reviews`, `QR Codes`, `Modern Web`, `Reusable Components`, `Learning Project`, `REST API`, `Codebooks`, `Teaching`, `Open Source`

---

## Conclusion

CodeBook is a comprehensive e-commerce platform that demonstrates modern React development practices, serverless architecture, and production-ready features. It serves as an excellent learning resource for:

- **React Development**: Hooks, Context API, React Query, component composition
- **State Management**: Multiple approaches (React Query, Context, Reducers)
- **API Integration**: RESTful API calls, authentication, error handling
- **UI/UX Design**: Responsive design, dark mode, accessible components
- **Payment Processing**: Stripe integration, secure checkout
- **Admin Features**: Dashboard, analytics, CRUD operations
- **Real-World Patterns**: Code organization, reusable components, custom hooks

The project structure is modular and scalable, making it easy to extend with new features or adapt for different use cases. All components are designed to be reusable, and the codebase follows best practices for maintainability and performance.

---

## Happy Coding! 🎉

Feel free to use this project repository and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://arnob-mahmud.vercel.app/](https://arnob-mahmud.vercel.app/).

**Enjoy building and learning!** 🚀

Thank you! 😊

---
