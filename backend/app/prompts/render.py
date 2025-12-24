from typing import Optional

from app.prompts.chat_prompt import BASE_SYSTEM_PROMPT, NOTE_CONTEXT_BLOCK


def render_chat_system_prompt(note: Optional[object]) -> str:

    system_prompt = BASE_SYSTEM_PROMPT

    if not note:
        return system_prompt

    note_content = getattr(note, "content", None)
    if not note_content:
        return system_prompt

    note_id = getattr(note, "id", None)
    note_title = getattr(note, "title", "") or ""

    return system_prompt + NOTE_CONTEXT_BLOCK.format(
        note_id=note_id if note_id is not None else "",
        note_title=note_title,
        note_content=note_content,
    )
