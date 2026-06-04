import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay')
  @ApiOperation({ summary: 'Make a demo payment for an appointment (PATIENT only)' })
  pay(@Request() req, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.pay(req.user.sub, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history (PATIENT only)' })
  getHistory(@Request() req) {
    return this.paymentsService.getHistory(req.user.sub);
  }
}
