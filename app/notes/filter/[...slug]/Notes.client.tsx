"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import css from "./NotesPage.module.css";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import ErrorMessage from "./error";

import { fetchNotes } from "../../../../lib/api";
import type { Note, TagWithAll } from "../../../../types/note";

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
  const [debouncedSearch] = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]);

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

        <Link href="/notes/action/create" className={css.button}>
          Create Note +
        </Link>
      </header>

      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && error && <ErrorMessage error={error} />}

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p className={css.description}>No notes found</p>
      )}
    </div>
  );
};

export default Notes;
