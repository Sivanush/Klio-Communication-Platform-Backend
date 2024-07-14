export interface IServerMember {
    server?: {
      _id: string;
      name: string;
      image?: string;
    },
    roles:string[]
  }