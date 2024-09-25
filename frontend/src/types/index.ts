type User = {
  user_id: string;
  user_name: string;
  image_url: string | null;
};

interface PostedDate {
  _seconds: number;
  _nanoseconds: number;
}

interface Message {
  id: string;
  user_id: string;
  subject: string;
  image_url: string;
  content: string;
  posted_date: PostedDate;
}

export type { User, Message, PostedDate };
