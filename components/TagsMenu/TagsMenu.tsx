"use client";
import { useState } from "react";
import Link from "next/link";
import { TagWithAll } from "../../types/note";
import css from "./TagsMenu.module.css";

type Props = {
  categories: TagWithAll[];
};

const TagsMenu = ({ categories }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuButton}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {categories.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={
                  tag === "All" ? `/notes/filter/all` : `/notes/filter/${tag}`
                }
                onClick={toggle}
                className={css.menuLink}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
