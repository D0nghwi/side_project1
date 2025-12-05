import React, { useState } from "react";

// 더미 데이터 - 나중에 백엔드에서 불러오는 데이터로 대체
const initialFlashcards = [
  {
    id: 1,
    question: "React에서 컴포넌트란 무엇인가?",
    answer:
      "UI를 작은 조각으로 나눈 재사용 가능한 단위. 함수형 컴포넌트가 가장 많이 쓰이고, props를 받아 JSX를 반환",
    tags: ["react", "components"],
  },
  {
    id: 2,
    question: "useState 훅의 역할은?",
    answer:
      "컴포넌트 내부에서 상태(state)를 관리하게 해주는 훅. [value, setValue] 형태로 사용",
    tags: ["react", "hooks"],
  },
  {
    id: 3,
    question: "FastAPI의 주요 장점은?",
    answer:
      "타입 힌트를 기반으로 한 자동 검증, 빠른 성능, 자동 문서화, 비동기 지원",
    tags: ["fastapi", "backend"],
  },
  {
    id: 4,
    question: "현재 플래시카드는 더미 데이터입니다.",
    answer:
      "추후 백엔드와 연동하여 실제 데이터를 불러오고 저장하는 기능이 추가될 예정",
    tags: ["flashcards", "기능"],
  },
];

function FlashcardsPage() {
  const [flashcards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보고 있는 카드 인덱스
  const [showAnswer, setShowAnswer] = useState(false); // 답 보이기 여부
  const [knownCount, setKnownCount] = useState(0); // 맞음 개수
  const [unknownCount, setUnknownCount] = useState(0); // 틀림 개수

  const total = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const handleToggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleMarkKnown = () => {
    setKnownCount((prev) => prev + 1);
    handleNext();
  };

  const handleMarkUnknown = () => {
    setUnknownCount((prev) => prev + 1);
    handleNext();
  };

  const handleSelectCard = (index) => {
    setCurrentIndex(index);
    setShowAnswer(false);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    // 단순히 첫 카드로 이동만 구현
    setCurrentIndex(0);
    setShowAnswer(false);
    console.log("셔플 로직 구현 중.", shuffled);
  };

  return (
    <div className="flex h-full gap-4 p-4">
      {/* 왼쪽: 학습 영역 */}
      <section className="flex-1 bg-white rounded-lg shadow p-4 flex flex-col">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              플래시카드 학습
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              이후 자동으로 플래시카드를 생성하는 기능.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div>
              진행 상황:{" "}
              <span className="font-semibold">
                {currentIndex + 1} / {total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                맞음: {knownCount}
              </span>
              <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">
                틀림: {unknownCount}
              </span>
            </div>
          </div>
        </div>

        {/* 플래시카드 본문 */}
        <div className="flex-1 flex flex-col">
          {/* 질문 카드 */}
          <div className="flex-1 border rounded-lg p-4 mb-4 bg-gray-50 flex flex-col">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              질문
            </div>
            <div className="text-lg font-medium text-gray-900">
              {currentCard.question}
            </div>

            {/* 태그 */}
            {currentCard.tags && currentCard.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentCard.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 답안 카드 */}
          <div className="border rounded-lg p-4 mb-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">정답</span>
              <button
                type="button"
                onClick={handleToggleAnswer}
                className="text-xs px-2 py-1 rounded-md border text-gray-700 hover:bg-gray-50"
              >
                {showAnswer ? "정답 숨기기" : "정답 보기"}
              </button>
            </div>
            {showAnswer ? (
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {currentCard.answer}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                정답 보기를 누르면 답이 표시됨
              </p>
            )}
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
              >
                다음 →
              </button>
              <button
                type="button"
                onClick={handleShuffle}
                className="px-3 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-50"
              >
                섞기(구현 중)
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleMarkUnknown}
                className="px-3 py-2 text-sm rounded-md border border-red-600 text-red-600 hover:bg-red-50"
              >
                틀림
              </button>
              <button
                type="button"
                onClick={handleMarkKnown}
                className="px-3 py-2 text-sm rounded-md border border-green-600 text-green-600 hover:bg-green-50"
              >
                맞음
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside className="w-80 bg-white rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          카드 목록
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          추후 백엔드에서 불러오는
          데이터로 대체.
        </p>

        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {flashcards.map((card, index) => (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => handleSelectCard(index)}
                  className={`w-full text-left px-2 py-2 rounded-md text-xs ${
                    index === currentIndex
                      ? "bg-blue-50 border border-blue-300 text-blue-800"
                      : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">#{card.id}</span>
                    <span>
                      {index + 1} / {total}
                    </span>
                  </div>
                  <div className="truncate">{card.question}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default FlashcardsPage;
