# E-Bookstore

A full-stack online bookstore application with user authentication, shopping cart, payment integration, and admin management features.

## Features

### Customer Features
- User registration and authentication (JWT-based)
- Browse and search books by title, author, or category
- Add books to cart and manage quantities
- Secure checkout with Stripe payment integration
- Order history and tracking
- User profile management

### Admin Features
- Add, update, and delete books
- Manage book categories
- View and manage customer orders
- Update order status
- Inventory management

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.4.2**
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Database
- **Stripe API** - Payment processing
- **Maven** - Dependency management

### Frontend
- **React 19**
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Bootstrap 5** - UI components
- **Stripe React** - Payment UI

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Frontend web server

## Prerequisites

Before running this application, make sure you have:

- **Java 17** or higher
- **Node.js 16+** and npm
- **MySQL 8.0** (or use Docker)
- **Maven 3.6+**
- **Docker & Docker Compose** (for containerized deployment)
- **Stripe Account** (for payment integration)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shivnarainms22/E-Bookstore.git
cd E-Bookstore
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Database
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=onlinebookstore

# JWT Secret (generate with: openssl rand -base64 64)
JWT_SECRET=your_secure_jwt_secret_key_here

# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_API_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# API URL
REACT_APP_API_URL=http://localhost:8080
```

## Running the Application

### Option 1: Using Docker (Recommended)

The easiest way to run the entire stack:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL: localhost:3307

**To stop the services:**
```bash
docker-compose down
```

### Option 2: Manual Setup

#### Backend (Spring Boot)

1. Navigate to the backend directory:
```bash
cd onlinebookstore
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Frontend (React)

1. Navigate to the frontend directory:
```bash
cd "react frontend/onlinebookstore"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

```
POST /signup - Register new user
POST /authenticate - Login user (returns JWT token)
```

### Customer Endpoints

```
GET /api/customer/books - Get all books
GET /api/customer/books/search?title={title} - Search books
POST /api/customer/cart - Add to cart
GET /api/customer/cart/{userId} - Get user's cart
POST /api/customer/place-order - Place an order
GET /api/customer/orders/{userId} - Get user's orders
POST /api/customer/create-payment-intent - Create Stripe payment intent
```

### Admin Endpoints

```
POST /api/admin/categories - Create category
GET /api/admin/categories - Get all categories
POST /api/admin/books - Add new book
GET /api/admin/books - Get all books
PUT /api/admin/books/{id} - Update book
DELETE /api/admin/books/{id} - Delete book
GET /api/admin/orders - Get all orders
PUT /api/admin/orders/{id}/status - Update order status
```

## Project Structure

```
E-Bookstore/
├── onlinebookstore/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/onlinebookstore/
│   │   │   │   ├── config/         # Security & configuration
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Data transfer objects
│   │   │   │   ├── entity/         # JPA entities
│   │   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── util/           # Utilities (JWT, etc.)
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # Unit tests
│   ├── Dockerfile
│   └── pom.xml
│
├── react frontend/onlinebookstore/  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/             # Admin dashboard components
│   │   │   ├── Auth/              # Login/Signup
│   │   │   └── Customer/          # Customer features
│   │   ├── services/              # API service layer
│   │   ├── App.jsx
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml              # Docker orchestration
├── .env.example                    # Environment template
├── .gitignore
└── README.md
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `securePassword123` |
| `MYSQL_DATABASE` | Database name | `onlinebookstore` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with `openssl rand -base64 64` |
| `JWT_EXPIRATION` | Token expiration time (ms) | `3600000` (1 hour) |
| `STRIPE_API_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8080` |

## Default Admin Credentials

After first run, you can create an admin user through the signup endpoint with role `ADMIN`.

## Testing

### Backend Tests
```bash
cd onlinebookstore
mvn test
```

### Frontend Tests
```bash
cd "react frontend/onlinebookstore"
npm test
```

## Troubleshooting

### Port Already in Use
If you get port conflicts:
- Frontend (3000): Change in `docker-compose.yml` or run React on different port
- Backend (8080): Change in `application.properties`
- MySQL (3307): Change in `docker-compose.yml`

### Database Connection Issues
- Ensure MySQL is running
- Check credentials in `.env` file
- Wait for MySQL health check to pass (Docker)

### Stripe Payment Issues
- Verify Stripe keys are correct in `.env`
- Use test cards from [Stripe Testing](https://stripe.com/docs/testing)
- Test card: `4242 4242 4242 4242` (any future date, any CVC)

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/shivnarainms22/E-Bookstore/issues).

---

**Built with** ❤️ **using Spring Boot & React**
