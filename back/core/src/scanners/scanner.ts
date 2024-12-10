import {ModuleScanner} from './module.scanner';

export class Scanner {
  public static scanMainModule(module: any) {
    ModuleScanner.scan(module.name, [module]);
  }

  public scan(module: any) {
    ModuleScanner.scan(module.name, [module]);
  }
}
