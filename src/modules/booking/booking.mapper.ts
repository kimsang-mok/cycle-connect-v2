import { Mapper } from '@src/libs/ddd';
import { BookingEntity } from './domain/booking.entity';
import { BookingOrmEntity } from './database/booking.orm-entity';
import { BookingResponseDto } from './dtos/booking.response.dto';
import { RentalPeriod } from '../bike/domain/value-objects/rental-period.value-object';
import { Price } from '../bike/domain/value-objects/price.value-object';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingMapper
  implements Mapper<BookingEntity, BookingOrmEntity, BookingResponseDto>
{
  toPersistence(entity: BookingEntity): BookingOrmEntity {
    const copy = entity.getProps();
    const orm = new BookingOrmEntity();
    orm.id = copy.id;
    orm.bikeId = copy.bikeId;
    orm.customerName = copy.customerName;
    orm.startDate = copy.period.start;
    orm.endDate = copy.period.end;
    orm.status = copy.status;
    orm.totalPrice = copy.totalPrice.unpack();
    orm.createdAt = copy.createdAt;
    orm.updatedAt = copy.updatedAt;
    return orm;
  }

  toDomain(record: BookingOrmEntity): BookingEntity {
    const entity = new BookingEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        bikeId: record.bikeId,
        customerName: record.customerName,
        period: new RentalPeriod({
          start: new Date(record.startDate),
          end: new Date(record.endDate),
        }),
        status: record.status,
        totalPrice: new Price(record.totalPrice),
      },
    });
    return entity;
  }

  toResponse(entity: BookingEntity): BookingResponseDto {
    const props = entity.getProps();
    const response = new BookingResponseDto(entity);
    response.bikeId = props.bikeId;
    response.customerName = props.customerName;
    response.startDate = props.period.start;
    response.endDate = props.period.end;
    response.status = props.status;
    response.totalPrice = props.totalPrice.unpack();
    return response;
  }
}
