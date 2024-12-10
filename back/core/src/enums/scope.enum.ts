export enum Scope {
  /**
   * The singleton scope will return the same instance, which is cached.
   * This scope is the default if no other scope is specified.
   * 
   * @example

   *  @Scope('singleton') // optional
   *  class User {
   *    private name: string;
   *  }
   */
  SINGLETON = 'singleton',

  /**
   * The prototype scope will a different instance every time it is requested.
   * 
   * @example

   *  @Scope('prototype')
   *  class User {
   *    private name: string;
   *  }
   */
  PROTOTYPE = 'prototype',

  /**
   * The request scope, we can define the request scope.
   * 
   * @example

   *  @Scope('request')
   *  class User {
   *    private name: string;
   *  }
   */
  REQUEST = 'request',
}
