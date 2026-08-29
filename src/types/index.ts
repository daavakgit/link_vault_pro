export type CategoryType = 
  | 'Coding'
  | 'Projects'
  | 'Career'
  | 'Education'
  | 'Social'
  | 'Learning'
  | 'Others';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILink {
  _id: string;
  userId: string;
  name: string;
  url: string;
  description?: string;
  category: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLinks: number;
  categoriesCount: number;
  addedThisWeek: number;
  percentageChange: number;
}
