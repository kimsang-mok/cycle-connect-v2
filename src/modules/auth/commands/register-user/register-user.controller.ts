import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { routesV1 } from '@src/configs/app.routes';
import { ApiErrorResponse, IdResponse } from '@src/libs/api';
import { CreateUserCommand } from '@src/modules/user/commands/create-user/create-user.command';
import { CreateUserRequestDto } from '@src/modules/user/commands/create-user/create-user.request.dto';
import { UserAlreadyExistsError } from '@src/modules/user/user.errors';

@Controller(routesV1.version)
@ApiTags(routesV1.auth.tag)
export class RegisterUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Register a user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @Post(routesV1.auth.register)
  async register(@Body() body: CreateUserRequestDto): Promise<IdResponse> {
    const command = new CreateUserCommand(body);

    const id: string = await this.commandBus.execute(command);

    return new IdResponse(id);
  }
}
