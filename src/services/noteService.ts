import axios from "axios";
import type { Note, CreateNoteInput } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const BASE_URL = "https://notehub-public.goit.study/api";
const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number = 12,
): Promise<FetchNotesResponse> {
  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage,
    },
  });
  return response.data;
}

export async function createNote(noteData: CreateNoteInput): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", noteData);
  return response.data;
}
export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
}
