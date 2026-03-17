import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): { name: string; version: string; docs: Record<string, string> } {
    return {
      name: 'Financial Services Platform',
      version: '0.0.1',
      docs: {
        health: 'GET /health',
        createEvent: 'POST /events',
        listEvents: 'GET /events',
        getEvent: 'GET /events/:id',
        createCustomer: 'POST /customers',
        listCustomers: 'GET /customers',
        createPortfolio: 'POST /portfolios',
        listPortfolios: 'GET /portfolios/:customerId',
        createInvestment: 'POST /investments',
        listInvestments: 'GET /investments/:portfolioId',
        retirementProjection: 'GET /retirement/projection/:customerId',
      },
    };
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
