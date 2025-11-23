# CodeBook Serverless API

Serverless backend API for CodeBook using AWS Lambda (via Vercel) and DynamoDB.

## Architecture

- **Runtime**: Vercel Serverless Functions (Node.js 20.x)
- **Database**: AWS DynamoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

```bash
cd codebook-frontend
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in `codebook-frontend/`:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-north-1

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend URL (for CORS if needed)
REACT_APP_HOST=http://localhost:3000
```

### 3. Create DynamoDB Tables

Run the table creation script:

```bash
node api/scripts/create-tables.js
```

This will create:
- `codebook-products`
- `codebook-featured-products`
- `codebook-orders`
- `codebook-users`

### 4. Migrate Data

Seed DynamoDB with initial data from `db.json`:

```bash
node api/scripts/migrate-dynamodb.js
```

## API Endpoints

All endpoints are prefixed with `/api`:

### Public Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/444/products` - Get all products (with optional `?name_like=search`)
- `GET /api/444/products/:id` - Get product by ID
- `GET /api/444/featured_products` - Get featured products

### Protected Endpoints (Require JWT Token)

- `GET /api/600/users/:id` - Get user by ID
- `GET /api/660/orders?user.id=:userId` - Get user orders
- `POST /api/660/orders` - Create new order

## Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Local Development

```bash
# Install Vercel CLI globally
npm install -g vercel

# Run locally
vercel dev
```

The API will be available at `http://localhost:3000/api/*`

## Deployment

### Deploy to Vercel

1. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Add all environment variables from `.env.local`

2. **Deploy**:
   ```bash
   vercel deploy
   ```

   Or connect your GitHub repo to Vercel for automatic deployments.

### Update Frontend Environment

Update `codebook-frontend/.env`:

```env
REACT_APP_HOST=https://your-vercel-app.vercel.app
REACT_APP_GUEST_LOGIN=test@example.com
REACT_APP_GUEST_PASSWORD=12345678
```

## Project Structure

```
api/
├── lib/
│   ├── dynamodb.js      # DynamoDB client setup
│   ├── auth.js          # JWT authentication utilities
│   ├── response.js      # Response helpers
│   ├── products.js      # Product data access
│   ├── users.js         # User data access
│   └── orders.js        # Order data access
├── 444/
│   ├── products.js      # Public product endpoints
│   └── featured_products.js
├── 600/
│   └── users/
│       └── [id].js      # Protected user endpoints
├── 660/
│   └── orders.js        # Protected order endpoints
├── login.js             # Login endpoint
├── register.js          # Registration endpoint
└── scripts/
    ├── create-tables.js # DynamoDB table creation
    └── migrate-dynamodb.js # Data migration
```

## Notes

- The number prefixes (444, 600, 660) match the original json-server-auth access codes for compatibility
- DynamoDB uses on-demand billing (free tier eligible)
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt

