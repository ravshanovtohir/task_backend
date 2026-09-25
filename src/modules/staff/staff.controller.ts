import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, StaffListQueryDto } from './dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RoleKey, Roles } from '@decorators';
import { IRequest } from '@interfaces';
import { ParseIdPipe } from '@pipes';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Create new role', description: 'Create new Role' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleKey.ADMIN)
  @Post()
  create(@Body() data: CreateStaffDto, @Req() request: IRequest) {
    return this.staffService.create(data, request.user.id);
  }

  @ApiOperation({ summary: 'Create new role', description: 'Create new Role' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleKey.ADMIN)
  @Get()
  findAll(@Query() query: StaffListQueryDto) {
    return this.staffService.findAll(query);
  }

  @ApiOperation({ summary: 'Create new role', description: 'Create new Role' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleKey.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id: number) {
    return this.staffService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new role', description: 'Create new Role' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleKey.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIdPipe) id: number, @Body() data: UpdateStaffDto, @Req() request: IRequest) {
    return this.staffService.update(id, data, request.user.id);
  }

  @ApiOperation({ summary: 'Create new role', description: 'Create new Role' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleKey.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id: number) {
    return this.staffService.remove(id);
  }
}
