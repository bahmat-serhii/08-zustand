// app/notes/filter/layout.tsx

import React from "react";

export default function NotesLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <section>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </section>
  );
}
