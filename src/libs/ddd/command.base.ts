import { randomUUID } from 'crypto';
import { AppRequestContext } from '../application/context';
import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard';

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

type CommandMetadata = {
  /**
   * ID for correlation purposes (for commands that
   * arrive from other microservices,logs correlation, etc).
   * */
  readonly correlationId: string;

  /**
   * Causation id to reconstruct execution order if needed
   */
  readonly causationId?: string;

  /**
   * ID of a user who invoked the command. Can be useful for
   * logging and tracking execution of commands and events
   */
  readonly userId?: string;

  /**
   * Time when the command occurred. Mostly for tracing purposes
   */
  readonly timestamp: number;
};

export class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  readonly id: string;

  readonly metadata: CommandMetadata;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Command props should not be empty',
      );
    }
    const ctx = AppRequestContext.current;
    this.id = props.id || randomUUID();
    this.metadata = {
      correlationId: props?.metadata?.correlationId || ctx.getRequestId(),
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
