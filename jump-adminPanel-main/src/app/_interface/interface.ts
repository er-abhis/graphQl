export interface userType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  profile_pic: string;
  positions: string;
  aboutMe: string;
  termsAndConditions: boolean;
  status: string;
  OTP:string;
  isVerified:boolean;
  createdAt:string;
  roles:[];
  comprensive_listings:[];
}


export interface valueType{
  id:number;
  name:string;
  createdAt:string;
  updatedAt:string;
}

export interface UserData {
  statusCode: number;
  responseCode: string;
  message: string;
  data?: (DataEntity)[] | null;
  pagination: Pagination;
}
export interface DataEntity {
  _id: string;
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  company: string;
  description:string;
  price:string;
  discount:string;
  profile_pic?: string | null;
  positions: string;
  aboutMe: string;
  termsAndConditions: boolean;
  status: string;
  OTP?: number | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: (RolesEntity)[] | null;
  comprensive_listings?: (ComprensiveListingsEntity | null)[] | null;
}
export interface RolesEntity {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: null;
  user_has_role: UserHasRole;
}
export interface UserHasRole {
  userId: number;
  roleId: number;
  createdAt: string;
  updatedAt?: string | null;
}
export interface ComprensiveListingsEntity {
  id: number;
  name: string;
  createdAt: string;
  updatedAt?: string | null;
  user_has_comprensive_listing: UserHasComprensiveListing;
}
export interface UserHasComprensiveListing {
  userId: number;
  comprensiveListingId: number;
  createdAt: string;
  updatedAt: string;
}
export interface Pagination {
  totalItems: number;
  totalpage: number;
  currentPage: number;
  nextPage: number;
  previousPage: number;
  limit: number;
}
