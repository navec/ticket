import {Module, Controller, Injectable, Get, BodyParam, ResParam} from './core';

// FIRST FIRST FIRST FIRST
@Injectable()
class FirstService {
  public get serviceName() {
    return FirstService.name;
  }
}

@Controller('first')
class FirstController {
  constructor(private service: FirstService) {
    console.log('FirstController ==> ', this.service.serviceName);
  }
}

@Module({
  controllers: [FirstController],
  providers: [FirstService],
})
class AuthFirstModuleBis {}

@Module({
  imports: [AuthFirstModuleBis],
  controllers: [FirstController],
  providers: [FirstService],
})
class AuthFirstModule {}

// SECOND SECOND SECOND SECOND
@Injectable()
class SecondService {
  constructor(private service: FirstService) {}
}

@Controller('second')
class SecondController {
  private lastName = 'batchi';
  private firstName = 'navec';

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  @Get('/name')
  getName(@BodyParam() body: any) {
    console.log({body});
    return {
      fullName: this.getFullName(),
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}

@Module({
  imports: [],
  controllers: [SecondController],
  providers: [FirstService, SecondService],
})
class AuthSecondModule {}

@Module({
  imports: [AuthFirstModule, AuthSecondModule],
})
export class AppModule {}
