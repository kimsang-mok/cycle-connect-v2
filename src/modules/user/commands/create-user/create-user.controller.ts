import { Body, Controller, Post } from '@nestjs/common';
import { routesV1 } from '@src/configs/app.routes';
import { CreateUserRequestDto } from './create-user.request.dto';
import { CreateUserCommand } from './create-user.command';
import { CommandBus } from '@nestjs/cqrs';
import { IdResponse } from '@src/libs/api';

@Controller(routesV1.version)
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.user.root)
  async create(@Body() body: CreateUserRequestDto) {
    const command = new CreateUserCommand({ ...body });

    const result = await this.commandBus.execute(command);

    return new IdResponse(result);
  }
}
