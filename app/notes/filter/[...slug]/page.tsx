import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import Notes from "./Notes.client";
import { Tag, type TagWithAll } from "@/types/note";

interface NotesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({ params }: NotesPageProps) {
  const awaitedParams = await params;
  const rawTag = awaitedParams.slug?.[0] ?? "All";
  const validTags: TagWithAll[] = ["All", ...Object.values(Tag)];
  const tag: TagWithAll = validTags.includes(rawTag as TagWithAll)
    ? (rawTag as TagWithAll)
    : "All";

  const pageTitle = tag === "All" ? "Notehub | All notes" : `Notehub | ${tag}`;
  const pageDescription =
    tag === "All"
      ? "View all notes created in the Notehub app."
      : `View notes tagged with "${tag}" in the Notehub app`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://notehub-public.goit.study/api`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const awaitedParams = await params;

  const queryClient = new QueryClient();

  const initialPage = 1;
  const initialSearch = "";
  const validTags: TagWithAll[] = ["All", ...Object.values(Tag)];

  const rawTag = awaitedParams.slug?.[0] ?? "All";
  const tag: TagWithAll = validTags.includes(rawTag as TagWithAll)
    ? (rawTag as TagWithAll)
    : "All";
  const tagParam = tag === "All" ? undefined : tag;

  const initialData = await fetchNotes({
    page: initialPage,
    search: initialSearch,
    tag: tagParam,
  });

  await queryClient.prefetchQuery({
    queryKey: [
      "notes",
      { page: initialPage, search: initialSearch, tag: tagParam },
    ],
    queryFn: () => Promise.resolve(initialData),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes
        initialPage={initialPage}
        initialSearch={initialSearch}
        initialData={initialData}
        tag={tag}
      />
    </HydrationBoundary>
  );
}
