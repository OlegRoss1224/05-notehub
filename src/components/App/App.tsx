import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import { SearchBox } from "../SearchBox/SearchBox";
import { NoteList } from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import { Pagination } from "../Pagination/Pagination";
import { Modal } from "../Modal/Modal";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query, 1000);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedQuery, page, perPage],
    queryFn: () => fetchNotes(debouncedQuery, page, perPage),
    placeholderData: (previousData) => previousData,
  });

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
        {isLoading && <p className={css.loader}>Загрузка карточек...</p>}
        {isError && <p className={css.error}>Ошибка загрузки данных!</p>}

        {!isLoading && !isError && notesList.length === 0 && (
          <p className={css.empty}>Коллекция пустая или ничего не найдено.</p>
        )}

        <NoteList notes={notesList} />
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSuccessClose={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
