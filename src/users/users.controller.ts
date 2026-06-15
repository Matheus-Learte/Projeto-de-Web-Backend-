import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Get()
    findAll() {
        return 'This action returns all users';
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const res = 2 + parseInt(id);
        return '2 + ' + id + ' é ' + res;
    }
}
