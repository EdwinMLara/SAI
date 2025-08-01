export interface PublicUser {
  image?: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  role: 'admin' | 'user';
}

export interface NewUser {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserUpdate {
  image: string;
  name: string;
  username: string;
  phone: string;
  password: string;
  email: string;
}
