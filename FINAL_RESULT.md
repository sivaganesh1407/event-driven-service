# Financial Services Platform – Final Result

## Project Status: Complete (Production-like)

**Build:** Passing  
**Tests:** 8 passed  
**Architecture:** Layered (models, repositories, services, controllers)

---

## Quick Start

```bash
# 1. Start MongoDB
docker-compose up -d mongodb

# 2. Install & run
npm install
npm run start:dev
```

API: **http://localhost:3000**

---

## API Response Format

**Success:** `{ "status": "success", "data": { ... } }`  
**Error:** `{ "status": "error", "statusCode": 400, "message": "...", "path": "..." }`

---

## Complete API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API docs (all endpoints) |
| GET | `/health` | Health check |
| POST | `/customers` | Create customer |
| GET | `/customers` | List customers |
| POST | `/portfolios` | Create portfolio |
| GET | `/portfolios/:customerId` | List portfolios for customer |
| POST | `/investments` | Create investment |
| GET | `/investments/:portfolioId` | List investments for portfolio |
| GET | `/retirement/projection/:customerId` | Retirement projection |
| POST | `/events` | Create event |
| GET | `/events` | List events |
| GET | `/events/:id` | Get event by ID |

---

## Sample Workflow

```bash
# 1. Create customer
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","retirementGoal":500000,"riskProfile":"MODERATE"}'

# 2. Create portfolio (use id from step 1)
curl -X POST http://localhost:3000/portfolios \
  -H "Content-Type: application/json" \
  -d '{"customerId":"<CUSTOMER_ID>","portfolioName":"Retirement 401k"}'

# 3. Create investment (use portfolio id from step 2)
curl -X POST http://localhost:3000/investments \
  -H "Content-Type: application/json" \
  -d '{"portfolioId":"<PORTFOLIO_ID>","assetName":"AAPL","amount":1750}'

# 4. Get retirement projection
curl http://localhost:3000/retirement/projection/<CUSTOMER_ID>
```

---

## Project Structure

```
src/
├── models/           # Mongoose schemas (Customer, Portfolio, Investment)
├── repositories/     # Data access layer
├── services/         # Business logic
├── controllers/      # API layer
├── common/           # DTOs, filters, interceptors
├── modules/          # NestJS module wiring
├── events/           # Event store (CDC)
├── app.module.ts
└── main.ts
```

---

## Data Models

**Customer:** id, name, email, retirementGoal, riskProfile (CONSERVATIVE|MODERATE|AGGRESSIVE)  
**Portfolio:** id, customerId, portfolioName  
**Investment:** id, portfolioId, assetName, amount  
**Event:** type, payload, createdAt  

---

## Retirement Projection

- **Compound growth:** FV = PV × (1 + r)^n
- **Simple growth:** FV = PV × (1 + r × n)
- **Risk-based return:** CONSERVATIVE 4%, MODERATE 6%, AGGRESSIVE 8%
- **Output:** currentPortfolioValue, projectedValueCompound, projectedValueSimple, retirementGoal, gapToGoal
