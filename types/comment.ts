export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  text: string;
  parent_comment_id: string | null;
  nesting_level: number;
  created_at: Date;
  replies?: Comment[];
}

export interface CreateCommentData {
  article_id: string;
  text: string;
  parent_comment_id?: string | null;
}
