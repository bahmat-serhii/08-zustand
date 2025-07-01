// app/notes/filter/@sidebar/default.tsx

import Link from "next/link";
import { Tag } from "../../../../types/note";
import css from "./SidebarNotes.module.css";

const tags = ["All", ...Object.values(Tag)];

const SidebarNotes = () => {
  return (
    <ul className={css.menuList}>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
