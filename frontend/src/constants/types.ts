export interface AdminExpanded {
  message: string;
  user: {
    email: string;
    id: number;
    firstname: string;
    lastname: string;
    created_at: string;
    updated_at: string;
  };
  access: string;
  refresh?: string;
}
