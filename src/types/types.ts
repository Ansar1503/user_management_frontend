export type FormState<T> = {
    data: T;
    errors: Partial<Record<keyof T, string>>;
  };
  
  export type SignUpData = {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    role: string;
    password: string;
  };
  
  export type SignInData = {
    email: string;
    password: string;
  };

  