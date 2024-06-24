export class User {
    constructor(

        public username: string | undefined,
        public email: string,
        public password: string,
        public isVerified: boolean,
        public isBlocked: boolean,
        public image: string | undefined,
        public _id?: string,
        public photoURL?: string,
        public displayName?: string, 
        public uid?: string |Buffer,
        public resetToken?:string|undefined,
        public resetTokenExpire?:number|undefined,


    ) { }
}

export interface DecodedData {
    email: string;
    otp: string
}

