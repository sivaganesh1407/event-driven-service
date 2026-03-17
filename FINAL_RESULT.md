# Financial Services Platform – Final Result

## Project Status: Complete

**Build:** Passing  
**Tests:** 8 passed  
**Modules:** Events, Customers, Portfolios, Investments, Retirement

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

## Sample Workflow (Copy & Paste)

```bash
# 1. Create customer
CUSTOMER=$(curl -s -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","dateOfBirth":"1985-05-15","retirementAge":65}')
echo $CUSTOMER

# 2. Create portfolio (use id from step 1)
curl -X POST http://localhost:3000/portfolios \
  -H "Content-Type: application/json" \
  -d '{"customerId":"<CUSTOMER_ID>","name":"Retirement 401k"}'

# 3. Create investment (use portfolio id from step 2)
curl -X POST http://localhost:3000/investments \
  -H "Content-Type: application/json" \
  -d '{"portfolioId":"<PORTFOLIO_ID>","type":"STOCK","symbol":"AAPL","shares":10,"purchasePrice":150,"currentValue":175,"purchaseDate":"2024-01-15"}'

# 4. Get retirement projection
curl http://localhost:3000/retirement/projection/<CUSTOMER_ID>
```

---

## Project Structure

```
src/
├── common/filters/          # Global error handling
├── customers/               # Customer management
├── portfolios/              # Portfolio management
├── investments/             # Investment tracking
├── retirement/              # Retirement projection
├── events/                  # Event store (CDC)
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## Data Models

**Customer:** name, email, dateOfBirth, retirementAge  
**Portfolio:** customerId, name  
**Investment:** portfolioId, type (STOCK|BOND|MUTUAL_FUND|ETF), symbol, shares, purchasePrice, currentValue, purchaseDate  
**Event:** type, payload, createdAt  

---

## Retirement Projection Logic

- **Input:** Customer age, retirement age, portfolio value
- **Assumptions:** 6% annual return, $500/month contribution
- **Output:** `currentPortfolioValue`, `projectedValueAtRetirement`, `yearsToRetirement`, `assumptions`
