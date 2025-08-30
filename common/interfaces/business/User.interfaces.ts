export interface UserInt {
   image?: string;
   name: string;
   username: string;
   phone: string;
   email: string;
   password: string;
   role: 'admin' | 'user';
}

export interface UserChangesInt {
   image?: string;
   name: string;
   username: string;
   phone: string;
   password: string;
   email: string;
}

export interface PublicUserInt {
   image?: string;
   name: string;
   username: string;
   phone: string;
   email: string;
   role: 'admin' | 'user';
}

export interface NewUserInt {
   name: string;
   username: string;
   email: string;
   phone: string;
   password: string;
}

export interface UserCredentialsInt {
   email: string;
   password: string;
}
