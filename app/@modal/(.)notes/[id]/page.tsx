// app/@modal/(.)notes/[id]/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById, getQueryClient } from "@/lib/api";
import NotePreview from "./NotePreview.client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePreviewModal({ params }: Props) {
  const { id } = await params;
  const noteId = Number(id);

  if (isNaN(noteId)) return null;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreview noteId={noteId} />
    </HydrationBoundary>
  );
}
