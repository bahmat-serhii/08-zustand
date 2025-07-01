import axios from "axios";
import type { Note, CreateNoteData, TagWithAll } from "../types/note";
import { QueryClient } from "@tanstack/react-query";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: TagWithAll;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page };

  if (search && search.trim() !== "") {
    params.search = search;
  }

  if (tag && tag !== "All") {
    params.tag = tag;
  }

  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/notes/${id}`);
  return response.data;
};

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}
