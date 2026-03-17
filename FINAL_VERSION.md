# Financial Services Platform – Final Version

**Version:** 0.0.1  
**Status:** Production-ready  
**Build:** ✅ Passing  
**Tests:** ✅ 8 unit + 1 e2e

---

## Quick Start

**Option A – Docker (full stack)**
```bash
docker-compose up -d
```
API: http://localhost:3000

**Option B – Local dev**
```bash
docker-compose up -d mongodb
npm install
npm run start:dev
```
API: http://localhost:3000

---

## Project Structure

```
src/
├── models/              # Data models (Mongoose schemas)
│   ├── customer.model.ts
│   ├── portfolio.model.ts
│   ├── investment.model.ts
│   └── index.ts
├── repositories/         # Data access layer
│   ├── customer.repository.ts
│   ├── portfolio.repository.ts
│   ├── investment.repository.ts
│   └── index.ts
├── services/            # Business logic
│   ├── customer.service.ts
│   ├── portfolio.service.ts
│   ├── investment.service.ts
│   └── retirement.service.ts
├── controllers/         # API layer
│   ├── customer.controller.ts
│   ├── portfolio.controller.ts
│   ├── investment.controller.ts
│   └── retirement.controller.ts
├── common/
│   ├── dto/             # Create DTOs with validation
│   ├── filters/         # HTTP exception filter
│   └── interceptors/     # Response wrapper
├── modules/
│   └── financial.module.ts
├── events/              # Event store (CDC)
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## Data Models

| Model | Fields |
|-------|--------|
| **Customer** | id, name, email, retirementGoal, riskProfile (CONSERVATIVE\|MODERATE\|AGGRESSIVE) |
| **Portfolio** | id, customerId, portfolioName |
| **Investment** | id, portfolioId, assetName, amount |

---

## API Response Format

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "path": "/customers",
  "timestamp": "2026-03-17T14:00:00.000Z"
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API docs |
| GET | `/health` | Health check |
| POST | `/customers` | Create customer |
| GET | `/customers` | List customers |
| POST | `/portfolios` | Create portfolio |
| GET | `/portfolios/:customerId` | List portfolios |
| POST | `/investments` | Create investment |
| GET | `/investments/:portfolioId` | List investments |
| GET | `/retirement/projection/:customerId` | Retirement projection |
| POST | `/events` | Create event |
| GET | `/events` | List events |
| GET | `/events/:id` | Get event by ID |

---

## Sample Requests

### Create Customer
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","retirementGoal":500000,"riskProfile":"MODERATE"}'
```

### Create Portfolio
```bash
curl -X POST http://localhost:3000/portfolios \
  -H "Content-Type: application/json" \
  -d '{"customerId":"<CUSTOMER_ID>","portfolioName":"Retirement 401k"}'
```

### Create Investment
```bash
curl -X POST http://localhost:3000/investments \
  -H "Content-Type: application/json" \
  -d '{"portfolioId":"<PORTFOLIO_ID>","assetName":"AAPL","amount":1750}'
```

### Retirement Projection
```bash
curl http://localhost:3000/retirement/projection/<CUSTOMER_ID>
```

---

## Validations

- **Required fields:** `@IsNotEmpty`
- **Email:** `@IsEmail`
- **Investment amount:** `@Min(0.01)` (positive)
- **Risk profile:** `@IsEnum` (CONSERVATIVE, MODERATE, AGGRESSIVE)
- **IDs:** `@IsMongoId`

---

## Retirement Calculation

- **Compound growth:** FV = PV × (1 + r)^n
- **Simple growth:** FV = PV × (1 + r × n)
- **Risk-based return:** CONSERVATIVE 4%, MODERATE 6%, AGGRESSIVE 8%
- **Output:** currentPortfolioValue, projectedValueCompound, projectedValueSimple, retirementGoal, gapToGoal

---

## Commands

```bash
npm run build        # Build
npm run start:dev    # Dev (watch)
npm run start:prod   # Production
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run lint         # Lint
npm run docker:up    # Start full stack (MongoDB + App) in Docker
npm run docker:down  # Stop Docker containers
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| MONGODB_URI | mongodb://localhost:27017/event-driven-service | MongoDB connection |

Copy `.env.example` to `.env` and adjust as needed.
