import { Command } from '@src/libs/ddd';
import { CommandProps } from '@src/libs/ddd';

export class CreatePresignedUrlCommand extends Command {
  filename: string;

  mimetype: string;

  uploaderId: string;

  constructor(props: CommandProps<CreatePresignedUrlCommand>) {
    super(props);
    this.filename = props.filename;
    this.mimetype = props.mimetype;
    this.uploaderId = props.uploaderId;
  }
}
