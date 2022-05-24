import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  email: string | null;
  birthday: BirthdayDate;
  fName: string;
  lName: string;
  picture: string;
};
export type BirthdayDate = {
  day: number;
  month: number;
  year: number;
};

export type SignUpType = {
  fName: string;
  lName: string;
  email: string;
  birthday: BirthdayDate;
  password: string;
  confirmPassword: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type chatRoom = {
  createdAt: Timestamp;
  id: string;
  updatedAt: Timestamp;
  userIds: [string, string];
  lastMessage: string;
};

export type Message = {
  message: string;
  messageId: string;
  sender: string;
  type: string;
  createdAt: Timestamp;
};
