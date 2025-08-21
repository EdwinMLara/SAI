export interface UserInt {
  image?: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  role: 'super' | 'admin' | 'user';
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
  role: 'super' | 'admin' | 'user';
}
