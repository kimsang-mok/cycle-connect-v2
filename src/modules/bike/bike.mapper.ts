import { Mapper } from '@src/libs/ddd';
import { BikeEntity } from './domain/bike.entity';
import { BikeResponseDto } from './dtos/bike.response.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Price } from './domain/value-objects/price.value-object';
import { BikeOrmEntity } from './database/bike.orm-entity';
import { FILE_URL_RESOLVER } from '@src/libs/uploader/uploader.di-tokens';
import { FileUrlResolverServicePort } from '@src/libs/uploader/ports/file-url-resolver.service.port';

@Injectable()
export class BikeMapper
  implements Mapper<BikeEntity, BikeOrmEntity, BikeResponseDto>
{
  constructor(
    @Inject(FILE_URL_RESOLVER)
    private readonly fileUrlResolver: FileUrlResolverServicePort,
  ) {}

  toPersistence(entity: BikeEntity): BikeOrmEntity {
    const copy = entity.getProps();
    const orm = new BikeOrmEntity();
    orm.id = copy.id;
    orm.createdAt = copy.createdAt;
    orm.updatedAt = copy.updatedAt;
    orm.ownerId = copy.ownerId;
    orm.type = copy.type;
    orm.model = copy.model;
    orm.enginePower = copy.enginePower;
    orm.pricePerDay = copy.pricePerDay.unpack();
    orm.description = copy.description;
    orm.isActive = copy.isActive;
    orm.photoKeys = copy.photoKeys;
    orm.thumbnailKey = copy.thumbnailKey;
    orm.districtCode = copy.districtCode;

    return orm;
  }

  toDomain(record: BikeOrmEntity): BikeEntity {
    const entity = new BikeEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        ownerId: record.ownerId,
        type: record.type,
        model: record.model,
        enginePower: record.enginePower,
        pricePerDay: new Price(record.pricePerDay),
        description: record.description,
        isActive: record.isActive,
        photoKeys: record.photoKeys,
        thumbnailKey: record.thumbnailKey,
        districtCode: record.districtCode,
      },
    });
    return entity;
  }

  toResponse(entity: BikeEntity): BikeResponseDto {
    const props = entity.getProps();
    const response = new BikeResponseDto(props);
    response.ownerId = props.ownerId;
    response.type = props.type;
    response.model = props.model;
    response.enginePower = props.enginePower;
    response.pricePerDay = props.pricePerDay.unpack();
    response.description = props.description;
    response.isActive = props.isActive;
    response.photoUrls = props.photoKeys.map((key) =>
      this.fileUrlResolver.resolveUrl(key),
    );
    response.thumbnailUrl = this.fileUrlResolver.resolveUrl(props.thumbnailKey);
    response.districtCode = props.districtCode;
    return response;
  }
}
