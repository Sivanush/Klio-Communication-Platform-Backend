
export class Chat {
    constructor(
      public userId: string,
      public friendId: string,
      public message: string,
      public timestamp: Date = new Date(),
      public _id?: string
    ) {}
  }
  