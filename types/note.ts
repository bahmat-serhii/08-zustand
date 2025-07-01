export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tag;

  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: Tag;
}
export enum Tag {
  Todo = "Todo",
  Work = "Work",
  Personal = "Personal",
  Meeting = "Meeting",
  Shopping = "Shopping",
}

export type TagWithAll = Tag | "All";
