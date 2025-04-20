export type USER = {
    email: string,
    avatar: string,
    first_name?: string,
    name?: string,
    role: string,
    online_status: number
  };
  
  export type CHATTER = {
    sender: string,
    recipient: string,
    name?: string,
    first_name?: string,
    avatar: string,
    role: string,
    online_status: number
    group_id: string,
    message: string,
    created_at: string
  };