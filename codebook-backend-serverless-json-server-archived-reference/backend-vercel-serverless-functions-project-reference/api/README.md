# CodeBook Serverless API - Archived Reference

> ⚠️ **IMPORTANT: This is an ARCHIVED REFERENCE**  
> This backend implementation is **NOT currently used** in the CodeBook e-commerce project.  
> The current project uses **AWS Lambda functions** with **AWS API Gateway** (see `codebook/aws-lambda/`).  
> This directory is kept for **reference and learning purposes only**.

---

## 📌 Status: Archived Reference

This Vercel Serverless Functions implementation was an **intermediate backend** for the CodeBook project during migration from mock server to full serverless architecture. It has been **replaced** by a more robust AWS-native solution using:

- **AWS Lambda Functions** - Direct Lambda deployment (not via Vercel)
- **AWS API Gateway HTTP API** - Native AWS API routing
- **AWS DynamoDB** - NoSQL database (same as this reference)
- **AWS SAM (Serverless Application Model)** - Infrastructure as code
- **JWT Authentication** - Custom authentication system

**Current Backend Location:** `codebook/aws-lambda/`  
**Current Backend Documentation:** See `codebook/aws-lambda/README.md`

This archived reference is maintained for:

- **Learning purposes** - Understanding Vercel serverless functions
- **Reference** - Comparing Vercel vs AWS Lambda approaches
- **Educational value** - Demonstrating different serverless patterns
- **Migration history** - Documenting the evolution of the backend architecture

---

## Architecture

- **Runtime**: Vercel Serverless Functions (Node.js 20.x)
- **Database**: AWS DynamoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel

## Setup

### 1. Install Dependencies

```bash
cd codebook
npm install
```

### 2. Set Environment Variables

Create a `.env` file in `codebook/`:

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
node scripts/create-tables.js
```

This will create:

- `codebook-products`
- `codebook-featured-products`
- `codebook-orders`
- `codebook-users`

### 4. Migrate Data

Seed DynamoDB with initial data from `db.json`:

```bash
node scripts/migrate-dynamodb.js
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

```bash
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

Update `codebook/.env`:

```env
REACT_APP_HOST=https://your-vercel-app.vercel.app
REACT_APP_GUEST_LOGIN=test@example.com
REACT_APP_GUEST_PASSWORD=12345678
```

## Project Structure

```bash
api/
├── 444/
│   ├── products.js      # Public product endpoints
│   └── featured_products.js
├── 600/
│   └── users/
│       └── [id].js      # Protected user endpoints
├── 660/
│   └── orders.js        # Protected order endpoints
├── login.js             # Login endpoint
└── register.js          # Registration endpoint
lib/
├── dynamodb.js          # DynamoDB client setup
├── auth.js              # JWT authentication utilities
├── response.js          # Response helpers
├── products.js          # Product data access
├── users.js             # User data access
└── orders.js            # Order data access
scripts/
├── create-tables.js     # DynamoDB table creation
└── migrate-dynamodb.js  # Data migration
```

## Notes

- The number prefixes (444, 600, 660) match the original json-server-auth access codes for compatibility
- DynamoDB uses on-demand billing (free tier eligible)
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt

---

## Architecture Comparison

### This Architecture (Archived Reference)

```bash
Frontend (React)
    ↓
Vercel Serverless Functions (/api/*)
    ↓
AWS DynamoDB
```

**Characteristics:**

- ✅ Serverless - no server management
- ✅ Easy deployment via Vercel
- ✅ Integrated with Vercel frontend hosting
- ✅ DynamoDB for persistent storage
- ✅ JWT authentication
- ⚠️ Vercel function execution limits
- ⚠️ Vendor lock-in to Vercel
- ⚠️ Limited AWS service integration
- ⚠️ Function timeout constraints

### Current Architecture (Active)

```bash
Frontend (React on Vercel)
    ↓
AWS API Gateway (HTTP API)
    ↓
AWS Lambda Functions (Serverless)
    ↓
AWS DynamoDB
```

**Characteristics:**

- ✅ Full AWS ecosystem integration
- ✅ No vendor lock-in
- ✅ More flexible function configuration
- ✅ Better cost control (AWS Free Tier)
- ✅ Advanced features (Stripe, Brevo, Shippo)
- ✅ Infrastructure as code (SAM template)
- ✅ Better monitoring and logging (CloudWatch)
- ✅ Production-ready scalability

### Why the Migration?

The project migrated from Vercel Serverless Functions to AWS Lambda for:

1. **AWS Native Integration** - Direct access to AWS services (S3, SES, etc.)
2. **Better Control** - More configuration options (timeout, memory, etc.)
3. **Cost Efficiency** - AWS Free Tier provides more generous limits
4. **Feature Rich** - Easier integration with Stripe, Brevo, Shippo APIs
5. **Infrastructure as Code** - SAM template for version-controlled infrastructure
6. **Flexibility** - Not tied to Vercel's function execution model
7. **Scalability** - Better handling of high-traffic scenarios

### When to Use Each Approach

**Use Vercel Serverless Functions (This Reference):**

- Simple serverless APIs
- Frontend and backend on same platform (Vercel)
- Quick prototyping with Vercel
- Small to medium projects
- When you want integrated frontend/backend deployment

**Use AWS Lambda (Current):**

- Production applications requiring AWS services
- Complex integrations (payments, emails, shipping)
- Need for infrastructure as code
- Better cost optimization with AWS Free Tier
- Enterprise-grade scalability requirements
- Multi-cloud or AWS-first strategy

---

## Conclusion

The **CodeBook Serverless API** using Vercel Serverless Functions was a valuable intermediate step in the project's evolution. It demonstrated serverless architecture patterns and provided a bridge between the mock server and the current AWS Lambda implementation.

**Note:** While this Vercel serverless functions implementation is archived and no longer used in the active CodeBook project, it remains a valuable reference for understanding:

- Vercel Serverless Functions patterns
- Serverless API architecture
- DynamoDB integration in serverless functions
- JWT authentication in serverless environments
- Backend architecture evolution

For the current production backend, see `codebook/aws-lambda/README.md`.

---
