import { ValueObject } from '@src/libs/ddd';
import { ArgumentNotProvidedException } from '@src/libs/exceptions';
import { PaymentStatusType } from '../payment.types';

export interface PaymentStatusProps {
  value: PaymentStatusType;
  reason?: string;
}

export class PaymentStatus extends ValueObject<PaymentStatusProps> {
  get value(): PaymentStatusProps['value'] {
    return this.props.value;
  }

  static initiate(): PaymentStatus {
    return new PaymentStatus({ value: PaymentStatusType.initiated });
  }

  static pending(): PaymentStatus {
    return new PaymentStatus({ value: PaymentStatusType.pending });
  }

  static authorize(): PaymentStatus {
    return new PaymentStatus({ value: PaymentStatusType.authorized });
  }

  static succeeded(): PaymentStatus {
    return new PaymentStatus({ value: PaymentStatusType.succeeded });
  }

  static failed(reason: string): PaymentStatus {
    return new PaymentStatus({ value: PaymentStatusType.failed, reason });
  }

  isFinal(): boolean {
    const val = this.props.value;
    return (
      val === PaymentStatusType.succeeded || val === PaymentStatusType.failed
    );
  }

  is(status: PaymentStatusType): boolean {
    return this.props.value === status;
  }

  getFailureReason(): string | undefined {
    return this.props.reason;
  }

  protected validate(props: PaymentStatusProps): void {
    if (props.value === PaymentStatusType.failed && !props.reason) {
      throw new ArgumentNotProvidedException(
        'Failure reason must be provided for FAILED status',
      );
    }
  }
}
