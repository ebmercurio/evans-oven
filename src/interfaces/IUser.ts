export default interface IUser {
  uid: string;
  email?: string | null;
  favorites: string[]; // Or whatever type your favorites are
  displayName: string; // Optional field from Firebase Auth
  photoURL?: string | null;
  // Add other fields as needed
}
