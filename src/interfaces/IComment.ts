export interface ICommentReply {
  id: string;
  username: string;
  content: string;
  postedAt: string;
}

export default interface IComment {
  id?: string;
  username: string;
  content: string;
  postedAt: string;
  rating?: number | null;
  likes?: string[]; // Array of userIds who liked the comment
  replies?: ICommentReply[];
  reportCount?: number; // Number of times this comment has been reported
}
