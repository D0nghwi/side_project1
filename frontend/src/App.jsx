import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./interface/MainLayout";
import NotesListPage from "./page/Note/NotesListPage";
import NoteCreatePage from "./page/Note/NoteCreatePage";
import NoteDetailPage from "./page/Note/NoteDetailPage";
import NoteEditPage from "./page/Note/NoteEditPage";
import FlashcardsPage from "./page/Flashcard/FlashcardsPage";
import NotFoundPage from "./page/Error/NotFoundPage";

const queryClient = new QueryClient();

//router구조 및 공통레이아웃 연결
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/new" element={<NoteCreatePage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/notes/:id/edit" element={<NoteEditPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
