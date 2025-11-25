import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//파일 임포트시 {} 주의 (디폴트 익스포트된 것들은 {} 없이 임포트)
import MainLayout from "./layouts/MainLayout";
import NotesListPage from "./pages/NotesListPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import NotFoundPage from "./pages/NotFoundPage";

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
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
