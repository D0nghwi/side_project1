import { useEffect, useMemo, useState } from "react";
import { pages, card, text, pill, btn, form, alertBox } from "../../asset/style/uiClasses";
import { flashcardsApi } from "../../api/flashcardsApi";

function FlashcardsPage() {
  const [decks, setDecks] = useState([]);
  const [deckLoading, setDeckLoading] = useState(false);

  const [activeDeckId, setActiveDeckId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [noteIdInput, setNoteIdInput] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCards, setDraftCards] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);

  const total = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const fetchDecks = async () => {
    try {
      setDeckLoading(true);
      setError(null);

      const res = await flashcardsApi.listDecks();
      const data = res.data;
      setDecks(data);
    } catch (e) {
      const msg = e?.response?.data?.detail || "덱 목록을 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setDeckLoading(false);
    }
  };

  const fetchDeckDetail = async (deckId) => {
    try {
      setLoadingCards(true);
      setError(null);

      const res = await flashcardsApi.getDeck(deckId);
      const data = res.data;

      const cards = (data.cards || []).map((c) => ({
        id: c.id,
        question: c.question,
        answer: c.answer,
        tags: [],
      }));

      setActiveDeckId(deckId);
      setFlashcards(cards);

      setCurrentIndex(0);
      setShowAnswer(false);
      setKnownCount(0);
      setUnknownCount(0);
    } catch (e) {
      const msg = e?.response?.data?.detail || "덱 상세를 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleToggleAnswer = () => setShowAnswer((prev) => !prev);

  const handleNext = () => {
    if (total === 0) return;
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total === 0) return;
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
    if (flashcards.length <= 1) return;

    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setFlashcards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const resetDraft = () => {
    setDraftTitle("");
    setDraftCards([]);
  };

  const openCreate = () => {
    setIsCreateOpen(true);
    setError(null);
    resetDraft();
  };

  const closeCreate = () => {
    setIsCreateOpen(false);
    setError(null);
    resetDraft();
  };

  const toggleDraftChecked = (tempId) => {
    setDraftCards((prev) =>
      prev.map((c) => (c.temp_id === tempId ? { ...c, checked: !c.checked } : c))
    );
  };

  const updateDraftField = (tempId, field, value) => {
    setDraftCards((prev) =>
      prev.map((c) => (c.temp_id === tempId ? { ...c, [field]: value } : c))
    );
  };

  const handleGenerate = async () => {
    const noteId = Number(noteIdInput);
    if (!noteId || Number.isNaN(noteId)) {
      setError("노트 번호(숫자)를 입력해 주세요.");
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const res = await flashcardsApi.generate({
        note_id: noteId,
        mode: "rule",
      });

      const data = res.data;

      setDraftTitle(data.suggested_title || "새 덱");
      setDraftCards(
        (data.cards || []).map((c, idx) => ({
          ...c,
          order_index: idx,
          checked: true,
        }))
      );
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        setError("해당 노트를 찾을 수 없습니다.");
      } else {
        const msg = e?.response?.data?.detail || "카드 생성에 실패했습니다.";
        setError(msg);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDeck = async () => {
    const noteId = Number(noteIdInput);
    if (!draftTitle.trim()) {
      setError("덱 제목은 비울 수 없습니다.");
      return;
    }

    const selected = draftCards.filter((c) => c.checked);
    if (selected.length === 0) {
      setError("저장할 카드를 선택해 주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        note_id: noteId || null,
        title: draftTitle.trim(),
        source_type: "rule",
        cards: selected.map((c, idx) => ({
          order_index: idx,
          question: c.question,
          answer: c.answer,
        })),
      };

      const res = await flashcardsApi.createDeck(payload);
      const created = res.data;

      await fetchDecks();
      await fetchDeckDetail(created.id);
      closeCreate();
    } catch (e) {
      const msg = e?.response?.data?.detail || "덱 저장에 실패했습니다.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };
  
  const progressText = useMemo(() => {
    if (total === 0) return "0 / 0";
    return `${currentIndex + 1} / ${total}`;
  }, [total, currentIndex]);

  return (
    <div className={pages.flash.page}>
      <section className={`${card.base} ${pages.flash.mainSection}`}>
        <div className={pages.flash.headerRow}>
          <div>
            <h1 className={text.titleLg}>플래시카드 학습</h1>
            <p className={text.descXs}>노트 기반으로 덱을 생성하고(선택 저장), 덱 단위로 학습합니다.</p>
          </div>

          <div className={pages.flash.headerMeta}>
            <div>
              진행 상황: <span className="font-semibold">{progressText}</span>
            </div>

            <div className={pages.flash.rowGap2}>
              <span className={pill.known}>맞음: {knownCount}</span>
              <span className={pill.unknown}>틀림: {unknownCount}</span>
            </div>

            <button type="button" onClick={openCreate} className={btn.primarySm}>
              덱 생성
            </button>
          </div>
        </div>

        {error && <div className={alertBox.error}>{error}</div>}

        <div className={pages.flash.bodyCol}>
          <div className={pages.flash.qCard}>
            <div className={`${text.descXs} font-semibold mb-2`}>질문</div>

            {loadingCards ? (
              <div className={text.bodySm}>카드 불러오는 중...</div>
            ) : currentCard ? (
              <>
                <div className={text.qTitle}>{currentCard.question}</div>

                {currentCard.tags && currentCard.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentCard.tags.map((tag, idx) => (
                      <span key={idx} className={pill.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={text.bodySm}>오른쪽에서 덱을 선택하거나, 덱 생성을 진행하세요.</div>
            )}
          </div>

          <div className={pages.flash.aCard}>
            <div className={pages.flash.aHeader}>
              <span className={`${text.descXs} font-semibold`}>정답</span>

              <button
                type="button"
                onClick={handleToggleAnswer}
                className={`${btn.outlineBase} ${btn.outlineGray} text-xs px-2 py-1`}
                disabled={!currentCard}
              >
                {showAnswer ? "정답 숨기기" : "정답 보기"}
              </button>
            </div>

            {currentCard && showAnswer ? (
              <p className={text.bodyWrapSm}>{currentCard.answer}</p>
            ) : (
              <p className={`${text.mutedXs} italic`}>{currentCard ? "정답 보기를 누르면 답이 표시됨" : ""}</p>
            )}
          </div>

          <div className={pages.flash.bottomRow}>
            <div className={pages.flash.btnGroup}>
              <button
                type="button"
                onClick={handlePrev}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
                disabled={!currentCard}
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
                disabled={!currentCard}
              >
                다음 →
              </button>
              <button
                type="button"
                onClick={handleShuffle}
                className={`${btn.outlineBase} ${btn.outlineGray} px-3 py-2`}
                disabled={!currentCard}
              >
                섞기
              </button>
            </div>

            <div className={pages.flash.btnGroup}>
              <button
                type="button"
                onClick={handleMarkUnknown}
                className={`${btn.outlineBase} ${btn.outlineRed} px-3 py-2`}
                disabled={!currentCard}
              >
                틀림
              </button>
              <button
                type="button"
                onClick={handleMarkKnown}
                className={`${btn.outlineBase} ${btn.outlineBlue} px-3 py-2`}
                disabled={!currentCard}
              >
                맞음
              </button>
            </div>
          </div>
        </div>

        {isCreateOpen && (
          <div className={`${card.base} ${card.bordered} mt-4`}>
            <div className={pages.flash.rowBetween}>
              <div>
                <div className={text.sectionTitle}>덱 생성 (노트 기반)</div>
                <div className={text.descXs}>노트 번호로 생성 → 카드 선택/수정 → 저장</div>
              </div>
              <button type="button" onClick={closeCreate} className={`${btn.outlineBase} ${btn.outlineGray}`}>
                닫기
              </button>
            </div>

            <div className={pages.flash.createGrid}>
              <div className="md:col-span-1">
                <label className={form.label}>노트 번호</label>
                <input
                  className={form.input}
                  value={noteIdInput}
                  onChange={(e) => setNoteIdInput(e.target.value)}
                  placeholder="예: 1"
                />
              </div>

              <div className={pages.flash.createActions}>
                <button type="button" className={btn.primaryInline} onClick={handleGenerate} disabled={generating}>
                  {generating ? "생성 중..." : "카드 생성"}
                </button>

                <button
                  type="button"
                  className={`${btn.outlineBase} ${btn.outlineGray}`}
                  onClick={() => setDraftCards((prev) => prev.map((c) => ({ ...c, checked: true })))}
                  disabled={draftCards.length === 0}
                >
                  전체 선택
                </button>

                <button
                  type="button"
                  className={`${btn.outlineBase} ${btn.outlineGray}`}
                  onClick={() => setDraftCards((prev) => prev.map((c) => ({ ...c, checked: false })))}
                  disabled={draftCards.length === 0}
                >
                  전체 해제
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className={form.label}>덱 제목</label>
              <input
                className={form.input}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="기본: 노트 제목"
                disabled={draftCards.length === 0}
              />
            </div>

            <div className={pages.flash.rowBetweenMt4}>
              <button
                type="button"
                className={btn.submit}
                onClick={handleSaveDeck}
                disabled={saving || draftCards.length === 0}
              >
                {saving ? "저장 중..." : "선택 저장"}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {draftCards.length === 0 ? (
                <div className={card.dashed}>생성된 카드가 없습니다.</div>
              ) : (
                draftCards.map((c) => (
                  <div key={c.temp_id} className={`${card.bordered} p-3`}>
                    <div className={pages.flash.draftCardRow}>
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={c.checked}
                        onChange={() => toggleDraftChecked(c.temp_id)}
                      />

                      <div className={pages.flash.draftCardGrid}>
                        <div>
                          <label className={form.label}>Q</label>
                          <input
                            className={form.input}
                            value={c.question}
                            onChange={(e) => updateDraftField(c.temp_id, "question", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={form.label}>A</label>
                          <textarea
                            className={`${form.textarea} h-28`}
                            value={c.answer}
                            onChange={(e) => updateDraftField(c.temp_id, "answer", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      <aside className={`${card.base} ${pages.flash.aside}`}>
        <div className={pages.flash.rowBetween}>
          <div>
            <h2 className={text.sectionTitle}>덱 목록</h2>
            <p className={text.descXs}>덱을 선택하면 해당 묶음으로 학습합니다.</p>
          </div>
          <button
            type="button"
            className={`${btn.outlineBase} ${btn.outlineGray} text-xs px-2 py-1`}
            onClick={fetchDecks}
            disabled={deckLoading}
          >
            {deckLoading ? "갱신 중..." : "갱신"}
          </button>
        </div>

        <div className={pages.flash.asideList}>
          <ul className={pages.flash.asideUl}>
            {decks.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => fetchDeckDetail(d.id)}
                  className={`${pages.flash.itemBtnBase} ${
                    d.id === activeDeckId ? pages.flash.itemActive : pages.flash.itemInactive
                  }`}
                >
                  <div className={pages.flash.itemTopRow}>
                    <span className={pages.flash.itemId}>#{d.id}</span>
                    <span>{d.card_count} cards</span>
                  </div>
                  <div className={pages.flash.itemQuestion}>{d.title}</div>
                </button>
              </li>
            ))}
          </ul>

          {decks.length === 0 && <div className={card.dashed}>저장된 덱이 없습니다.</div>}
        </div>
      </aside>
    </div>
  );
}

export default FlashcardsPage;
