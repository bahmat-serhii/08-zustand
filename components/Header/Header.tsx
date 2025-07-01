// components/Header/Header.tsx

import css from "./Header.module.css";
import Link from "next/link";
import { fetchNotes } from "@/lib/api";
import { Tag } from "@/types/note";
import TagsMenu from "../TagsMenu/TagsMenu";

const Header = async () => {
  const { notes } = await fetchNotes({ page: 1 });
  const tags: Tag[] = Array.from(new Set(notes.map((note) => note.tag)));

  return (
    <header className={css.header}>
      <Link href="/">NoteHub</Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <TagsMenu categories={["All", ...tags]} />
          </li>
          <li>
            <Link href="/" aria-label="Home">
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
