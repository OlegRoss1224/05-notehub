import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  deleteNote,
} from "../../services/noteServices";
import type { CreateNoteInput } from "../../types/note";
import { SearchBox } from "../SearchBox/SearchBox";
import { NoteList } from "../NoteList/NoteList";
import { NoteForm } from "..//NoteForm/NoteForm";
import { Pagination } from "..//Pagination/Pagination";
import { Modal } from "..//Modal/Modal";
import css from "./App.module.css";

export default function App() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", query, page, perPage],
    queryFn: () => fetchNotes(query, page, perPage),
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: (noteData: CreateNoteInput) => createNote(noteData),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Не удалось удалить нотатку:", error);
    },
  });

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const notesList = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={handleSearchChange} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      <main className={css.mainContent}>
        {isLoading && <p className={css.loader}>Загрузка нотаток...</p>}
        {isError && <p className={css.error}>Ошибка загрузки данных!</p>}

        {!isLoading && !isError && notesList.length === 0 && (
          <p className={css.empty}>Коллекция пустая или ничего не найдено.</p>
        )}

        <NoteList
          notes={notesList}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={(noteData) => createMutation.mutate(noteData)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
