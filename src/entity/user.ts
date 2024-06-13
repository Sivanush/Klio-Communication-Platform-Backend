export class User {
    constructor(
        public username:string, 
        public email:string, 
        public password:string, 
        public isVerified:boolean, 
        public isBlocked:boolean,
        public image:string,
        public _id:string,
    ) { }
}

