# Financial Services Platform

A production-ready NestJS backend for managing retirement portfolios and customer investments. Combines **event-driven CDC simulation** with **financial services** modules for customer management, portfolio tracking, investments, and retirement projections.

## Overview

This platform provides:

- **Customer Management** – Create and list customers with retirement parameters
- **Portfolio Management** – Create portfolios linked to customers
- **Investment Tracking** – Track stocks, bonds, mutual funds, and ETFs per portfolio
- **Retirement Projection** – Project retirement value based on current holdings and assumptions
- **Event Store** – CDC-style event ingestion (ORDER_CREATED, PAYMENT_PROCESSED, USER_REGISTERED)

## Architecture

```
┌─────────────────┐     POST /events      ┌──────────────────┐
│  Order Service  │ ───────────────────► │                  │
└─────────────────┘                      │                  │
                                         │  Event Driven    │     ┌─────────────┐
┌─────────────────┐     POST /events     │  Service        │────►│  MongoDB    │
│ Payment Service │ ───────────────────► │  (NestJS)       │     │  (Events)   │
└─────────────────┘                      │                  │     └─────────────┘
                                         │                  │
┌─────────────────┐     POST /events     │                  │
│  Auth Service   │ ───────────────────► │                  │
└─────────────────┘                      └──────────────────┘
         │                                        ▲
         │                                        │ GET /events
         │                                        │
         └────────────────────────────────────────┘
                    Downstream consumers
```

### Design Decisions

- **Event Schema**: Each event has `type`, `payload`, and `createdAt`. The payload is a flexible object validated per event type.
- **Type-Specific Validation**: ORDER_CREATED requires `orderId` and `amount`; PAYMENT_PROCESSED requires `paymentId`, `orderId`; USER_REGISTERED requires `userId` and `email`.
- **Indexing**: MongoDB indexes on `type` and `createdAt` for efficient filtering and sorting.
- **Error Handling**: Global exception filter with structured error responses and appropriate HTTP status codes.
- **Logging**: NestJS Logger used throughout for request tracing and debugging.

## Tech Stack

- **NestJS** (TypeScript) – Backend framework
- **MongoDB** + **Mongoose** – Event persistence
- **class-validator** / **class-transformer** – DTO validation
- **Docker** – MongoDB containerization

## Setup

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for MongoDB)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` if needed. Default values work with local Docker MongoDB.

### 3. Start MongoDB

```bash
docker-compose up -d mongodb
```

Verify MongoDB is running:

```bash
docker-compose ps
```

### 4. Run the Application

**Development** (watch mode):

```bash
npm run start:dev
```

**Production**:

```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Health Check

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /health       | Service health     |

### Customers

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| POST   | /customers     | Create a customer              |
| GET    | /customers     | List all customers             |

### Portfolios

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /portfolios           | Create a portfolio             |
| GET    | /portfolios/:customerId | List portfolios for a customer |

### Investments

| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | /investments            | Create an investment           |
| GET    | /investments/:portfolioId | List investments for a portfolio |

### Retirement

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | /retirement/projection/:customerId | Get retirement projection   |

### Events

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| POST   | /events        | Create a new event             |
| GET    | /events        | List events (with filters)     |
| GET    | /events/:id    | Get event by ID                |

### Request/Response Examples

**POST /events** – Create event

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ORDER_CREATED",
    "payload": {
      "orderId": "ord_123",
      "amount": 99.99,
      "currency": "USD"
    }
  }'
```

Response (201):

```json
{
  "id": "65f1234567890abcdef12345",
  "type": "ORDER_CREATED",
  "payload": {
    "orderId": "ord_123",
    "amount": 99.99,
    "currency": "USD"
  },
  "createdAt": "2025-03-17T14:00:00.000Z"
}
```

**GET /events** – List events

```bash
# All events (default limit 10)
curl http://localhost:3000/events

# Filter by type, paginate
curl "http://localhost:3000/events?type=ORDER_CREATED&limit=20&offset=0"
```

**GET /events/:id** – Get by ID

```bash
curl http://localhost:3000/events/65f1234567890abcdef12345
```

### Financial APIs – Quick Examples

**POST /customers**
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","retirementGoal":500000,"riskProfile":"MODERATE"}'
```

**POST /portfolios**
```bash
curl -X POST http://localhost:3000/portfolios \
  -H "Content-Type: application/json" \
  -d '{"customerId":"<customer_id>","portfolioName":"Retirement 401k"}'
```

**POST /investments**
```bash
curl -X POST http://localhost:3000/investments \
  -H "Content-Type: application/json" \
  -d '{"portfolioId":"<portfolio_id>","assetName":"AAPL","amount":1750}'
```

**GET /retirement/projection/:customerId**
```bash
curl http://localhost:3000/retirement/projection/<customer_id>
```

### Event Types & Payload Schemas

| Type              | Required Payload Fields              |
|-------------------|--------------------------------------|
| ORDER_CREATED     | `orderId` (string), `amount` (number/string) |
| PAYMENT_PROCESSED | `paymentId` (string), `orderId` (string)    |
| USER_REGISTERED   | `userId` (string), `email` (string)         |

## Project Structure

```
src/
├── common/
│   └── filters/
│       └── http-exception.filter.ts
├── customers/
├── portfolios/
├── investments/
├── retirement/
├── events/
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## Testing

```bash
npm run test
```

## License

UNLICENSED
