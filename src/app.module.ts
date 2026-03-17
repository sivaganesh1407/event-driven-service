import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/events.module';
import { CustomersModule } from './customers/customers.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { InvestmentsModule } from './investments/investments.module';
import { RetirementModule } from './retirement/retirement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/event-driven-service'),
        retryAttempts: 3,
      }),
      inject: [ConfigService],
    }),
    EventsModule,
    CustomersModule,
    PortfoliosModule,
    InvestmentsModule,
    RetirementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
