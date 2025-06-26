import { FileUploaderServicePort } from '@src/libs/uploader/ports/file-uploader.service.port';
import { CreatePresignedUrlService } from './create-presigned-url.service';
import { CreatePresignedUrlCommand } from './create-presigned-url.command';
import { mockInterface } from '@tests/utils';

describe('CreatePresignedUrlService', () => {
  let service: CreatePresignedUrlService;
  let uploader: jest.Mocked<FileUploaderServicePort>;

  const requestProps = {
    mimetype: 'image/jpeg',
    uploaderId: 'user-123',
    filename: 'example.jpg',
  };

  beforeEach(async () => {
    uploader = mockInterface<FileUploaderServicePort>();

    service = new CreatePresignedUrlService(uploader);
  });

  it('should return a presigned URL from uploader', async () => {
    const command = new CreatePresignedUrlCommand(requestProps);

    const mockResult = {
      key: 'uploads/user-123/123456-example.jpg',
      url: 'https://s3.fake.amazonaws.com/upload/abc123',
    };

    uploader.generatePresignedUrl.mockResolvedValue(mockResult);

    const result = await service.execute(command);

    expect(result).toEqual(mockResult);
    expect(uploader.generatePresignedUrl).toHaveBeenCalled();
  });
});
