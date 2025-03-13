// import IUser from './IUser';

export default interface IComment {
  id?: string,
  username: string,
  content: string,
  postedAt: string,
  rating?: number | null,
}
