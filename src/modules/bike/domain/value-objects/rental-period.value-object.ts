import { ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export interface RentalPeriodProps {
  start: Date;
  end: Date;
}

export class RentalPeriod extends ValueObject<RentalPeriodProps> {
  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  getDurationInDays(): number {
    const msDiff = this.props.end.getTime() - this.start.getTime();
    // Convert ms to days:
    return Math.ceil(msDiff / (1000 * 60 * 60 * 24));
  }

  overlaps(other: RentalPeriod): boolean {
    const thisStart = this.stripTime(this.start);
    const thisEnd = this.stripTime(this.end);
    const otherStart = this.stripTime(other.start);
    const otherEnd = this.stripTime(other.end);

    return thisStart <= otherEnd && thisEnd >= otherStart;
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  protected validate(props: RentalPeriodProps): void {
    if (
      !(props.start instanceof Date && props.end instanceof (Date || undefined))
    ) {
      throw new ArgumentInvalidException('Invalid date type for RentalPeriod');
    }

    if (props.end instanceof Date && props.end <= props.start) {
      throw new ArgumentInvalidException(
        'RentalPeriod end date must be after start date',
      );
    }
  }
}
