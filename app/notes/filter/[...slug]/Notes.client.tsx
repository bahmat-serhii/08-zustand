"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import css from "./NotesPage.module.css";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import Modal from "../../../../components/Modal/Modal";
import Pagination from "../../../../components/Pagination/Pagination";

import { fetchNotes } from "../../../../lib/api";
import type { Note, TagWithAll } from "../../../../types/note";
import ErrorMessage from "./error";
import { NoteForm } from "../../../../components/NoteForm/NoteForm";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesProps {
  initialPage: number;
  initialSearch: string;
  initialData: NotesResponse;
  tag: TagWithAll;
}

const Notes: React.FC<NotesProps> = ({
  initialPage,
  initialSearch,
  initialData,
  tag,
}) => {
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [debouncedSearch] = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]); // скидаємо сторінку також при зміні тегу

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag: tag === "All" ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
    initialData:
      page === initialPage && debouncedSearch === initialSearch
        ? initialData
        : undefined,
    refetchOnMount: false,
  });

  const handleSearch = useCallback((searchText: string) => {
    setSearchInput(searchText);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={handleSearch}
          onSearch={() => {}}
        />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create Note +
        </button>
      </header>

      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && error && <ErrorMessage error={error} />}

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={css.description}>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Notes;
