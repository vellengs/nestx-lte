export interface IAccount {
  username: string;
  password?: string;
  name: string;
  keyword: string;
  avatar: string;
  type: string;
  groups: string[];
  roles: string[];
  email: string;
  mobile: string;
  profile?: any;
  isDisable: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  secret: string;
  expired: number;
  // comparePassword: (password: string, cb: any) => void;
}
