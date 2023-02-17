import { Module, Global } from '@nestjs/common';
import { AzureBlobService } from './azure-services.service';

@Global()
@Module({
  controllers: [],
  providers: [AzureBlobService],
  exports: [AzureBlobService],
})
export class AzureServicesModule {}
