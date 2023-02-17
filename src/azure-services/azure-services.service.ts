import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { uuid } from 'uuidv4';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { Multer } from 'multer';

@Injectable()
export class AzureBlobService {
  constructor(private readonly config: ConfigService) {}
  azureConnection = this.config.get<string>('AZURE_STORAGE_CONNECTION_STRING');
  containerName = this.config.get<string>('AZURE_BLOB_CONTAINER');

  // Upload file
  getBlobClient(fileName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(fileName);
    return blobClient;
  }

  async uploadFiles(file, containerName: string) {
    try {
      this.containerName = containerName;
      const blobClient = this.getBlobClient(this.containerName);

      const buffer = Buffer.from(file, 'base64');

      const blockBlobClient = blobClient.getBlockBlobClient();
      await blockBlobClient.upload(buffer, buffer.length);
    } catch (err: any) {
      console.log('operation failed', err.message);
    }
  }

  //   read file from azureblob
  async getFile(fileName: string, containerName: string) {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(fileName);
    const blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  //   delete file

  async deleteFile(filename: string, containerName: string) {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(filename);
    return await blobClient.deleteIfExists();
  }
}
