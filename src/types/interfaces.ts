export interface userData {
  _id?:string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  isBlocked?: boolean;
  role: string;
  address?: string;
  companyName?: string;
  dateOfBirth?: string;
  designation?:string;
  imageUrl?:string;
}

export interface FormDataState extends Omit<userData, "errors"> {
  errors: Partial<Record<keyof userData, string>>;
  file?:File | null
}