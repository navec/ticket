import {HttpMethod} from '../constants';

export type Route = {method: HttpMethod; handler: Function; path: string};
