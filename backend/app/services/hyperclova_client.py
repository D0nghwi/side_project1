
from typing import List, Dict
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

#네이버 HyperCLOVAX-SEED 1.5B 모델명
MODEL_NAME = "naver-hyperclovax/HyperCLOVAX-SEED-Text-Instruct-1.5B"

# 시작 시 한 번만 모델 로드
print("[HyperCLOVAX-SEED] 모델 로딩 시작...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    device_map={"": "cpu"},  
)
print("[HyperCLOVAX-SEED] 모델 로딩 완료!")


def build_chat_messages(
    system_prompt: str,
    user_messages: List[Dict[str, str]],
) -> List[Dict[str, str]]:
    
    # user_messages 예시: [{"role": "user", "content": "안녕"}]
    
    chat: List[Dict[str, str]] = []

    # 도구 목록 메시지 추가 (비어있는 상태로)
    chat.append({"role": "tool_list", "content": ""})

    # system 메시지 추가
    chat.append({"role": "system", "content": system_prompt})

    # user/assistant 메시지들 추가
    chat.extend(user_messages)
    return chat


def generate_chat_response(
    messages: List[Dict[str, str]],
    max_length: int = 512,
) -> str:
    # 토크나이징
    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,  # 마지막에 assistant 답변 자리 추가
        return_dict=True,
        return_tensors="pt",
    )


    device = model.device
    inputs = {k: v.to(device) for k, v in inputs.items()}

    input_ids = inputs["input_ids"] # (1, seq_len)
    
    # 응답 생성
    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_length=max_length,
            stop_strings=["<|endofturn|>", "<|stop|>"],
            tokenizer=tokenizer,
        )

    generated_ids = output_ids[0, input_ids.shape[1]:]  # 생성된 부분만 추출
    
    # 출력 디코딩
    answer_text = tokenizer.batch_decode(
        [generated_ids],
        skip_special_tokens=True,
    )[0]

    return answer_text
