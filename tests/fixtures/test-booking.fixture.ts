import { DataSource } from 'typeorm';

export async function createBooking(
  dataSource: DataSource,
  overrides?: Partial<{
    id: string;
    bikeId: string;
    customerName: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  }>,
) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const bookingId = overrides?.id ?? crypto.randomUUID();
  const bikeId = overrides?.bikeId ?? crypto.randomUUID();
  const customerName = overrides?.customerName ?? 'Jane Doe';
  const startDate = overrides?.startDate ?? new Date('2025-07-01');
  const endDate = overrides?.endDate ?? new Date('2025-07-03');
  const totalPrice = overrides?.totalPrice ?? 25;

  await queryRunner.query(
    `INSERT INTO bookings(
      id, bike_id, customer_name, start_date, end_date,
      total_price, created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, now(), now()
    )`,
    [bookingId, bikeId, customerName, startDate, endDate, totalPrice],
  );

  await queryRunner.release();

  return {
    bookingId,
    bikeId,
    customerName,
    startDate,
    endDate,
    totalPrice,
  };
}
