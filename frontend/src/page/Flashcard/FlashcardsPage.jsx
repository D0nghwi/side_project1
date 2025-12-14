import React, { useState } from "react";
import { pages, card, text, pill, btn } from "../../asset/style/uiClasses";

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
    <div className={pages.flash.page}>
      {/* 왼쪽: 학습 영역 */}
      <section className={`${card.base} ${pages.flash.mainSection}`}>
        {/* 상단 헤더 */}
        <div className={pages.flash.headerRow}>
          <div>
            <h1 className={text.titleLg}>플래시카드 학습</h1>
            <p className={text.descXs}>이후 자동으로 플래시카드를 생성하는 기능.</p>
          </div>

          <div className={pages.flash.headerMeta}>
            <div>
              진행 상황:{" "}
              <span className="font-semibold">
                {currentIndex + 1} / {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={pill.known}>맞음: {knownCount}</span>
              <span className={pill.unknown}>틀림: {unknownCount}</span>
            </div>
          </div>
        </div>

        {/* 플래시카드 본문 */}
        <div className={pages.flash.bodyCol}>
          {/* 질문 카드 */}
          <div className={pages.flash.qCard}>
            <div className={`${text.descXs} font-semibold mb-2`}>질문</div>
            <div className="text-lg font-medium text-gray-900">{currentCard.question}</div>

            {currentCard.tags && currentCard.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentCard.tags.map((tag, idx) => (
                  <span key={idx} className={pill.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 답안 카드 */}
          <div className={pages.flash.aCard}>
            <div className={pages.flash.aHeader}>
              <span className={`${text.descXs} font-semibold`}>정답</span>

              <button
                type="button"
                onClick={handleToggleAnswer}
                className={`${btn.outlineBase} ${btn.outlineGray} text-xs px-2 py-1`}
              >
                {showAnswer ? "정답 숨기기" : "정답 보기"}
              </button>
            </div>

            {showAnswer ? (
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {currentCard.answer}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">정답 보기를 누르면 답이 표시됨</p>
            )}
          </div>

          {/* 하단 버튼 영역 */}
          <div className={pages.flash.bottomRow}>
            <div className={pages.flash.btnGroup}>
              <button
                type="button"
                onClick={handlePrev}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
              >
                다음 →
              </button>
              <button
                type="button"
                onClick={handleShuffle}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
              >
                섞기(구현 중)
              </button>
            </div>

            <div className={pages.flash.btnGroup}>
              <button
                type="button"
                onClick={handleMarkUnknown}
                className={`${btn.outlineBase} ${btn.outlineRed} px-3 py-2`}
              >
                틀림
              </button>
              <button
                type="button"
                onClick={handleMarkKnown}
                className={`${btn.outlineBase} ${btn.outlineBlue} px-3 py-2`}
              >
                맞음
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 오른쪽: 카드 목록 */}
      <aside className={`${card.base} ${pages.flash.aside}`}>
        <h2 className={text.sectionTitle}>카드 목록</h2>
        <p className={text.descXs}>추후 백엔드에서 불러오는 데이터로 대체.</p>

        <div className={pages.flash.asideList}>
          <ul className={pages.flash.asideUl}>
            {flashcards.map((cardItem, index) => (
              <li key={cardItem.id}>
                <button
                  type="button"
                  onClick={() => handleSelectCard(index)}
                  className={`${pages.flash.itemBtnBase} ${
                    index === currentIndex ? pages.flash.itemActive : pages.flash.itemInactive
                  }`}
                >
                  <div className={pages.flash.itemTopRow}>
                    <span className={pages.flash.itemId}>#{cardItem.id}</span>
                    <span>
                      {index + 1} / {total}
                    </span>
                  </div>
                  <div className={pages.flash.itemQuestion}>{cardItem.question}</div>
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
