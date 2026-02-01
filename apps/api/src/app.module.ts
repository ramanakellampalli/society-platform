import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SocietiesModule } from './societies/societies.module';
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    SocietiesModule,
    FinancialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}