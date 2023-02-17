import { AzureBlobService } from '@/azure-services/azure-services.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(private readonly azureBlobService: AzureBlobService) {}
  containerName = process.env.AZURE_BLOB_CONTAINER;

  async create(file, user): Promise<any> {
    console.log(file);
    const response = await this.azureBlobService.uploadFiles(
      file[0],
      this.containerName,
    );

    //if (file.length === 1) return response.join('');

    console.log(response);
    return response;
  }

  async findAll(fileName: any, res: any) {
    const file = await this.azureBlobService.getFile(
      fileName,
      this.containerName,
    );
    return file.pipe(res);
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
