from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4


app = FastAPI(
    title="Interview AI",
    description="Local-first AI interview assistant",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InterviewStartRequest(BaseModel):
    mode: str


class InterviewStartResponse(BaseModel):
    session_id: str
    mode: str
    question: str


class InterviewAnswerRequest(BaseModel):
    session_id: str
    mode: str
    answer: str


class InterviewAnswerResponse(BaseModel):
    feedback: str
    next_question: str


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/interview/start", response_model=InterviewStartResponse)
def start_interview(request: InterviewStartRequest):

    questions = {
        "Technical": (
            "Can you explain a machine learning project you have worked on "
            "and describe your specific contribution?"
        ),
        "Research": (
            "Can you describe your research experience and explain the "
            "research problem you are currently most interested in?"
        ),
        "HR": (
            "Please introduce yourself and tell me what motivates you "
            "to pursue a career in AI and machine learning."
        ),
    }

    question = questions.get(
        request.mode,
        questions["Technical"],
    )

    return {
        "session_id": str(uuid4()),
        "mode": request.mode,
        "question": question,
    }


@app.post("/interview/answer", response_model=InterviewAnswerResponse)
def submit_answer(request: InterviewAnswerRequest):

    answer_length = len(request.answer.strip())

    if answer_length < 50:
        feedback = (
            "Your answer is quite brief. In an interview, try to provide "
            "more specific details and explain your own contribution."
        )
    else:
        feedback = (
            "Your answer provides a reasonable level of detail. "
            "Try to support your claims with specific examples, methods, "
            "results, or measurable outcomes."
        )

    follow_up_questions = {
        "Technical": (
            "What technical challenges did you encounter during that "
            "project, and how did you address them?"
        ),
        "Research": (
            "What methodology did you use in your research, and why did "
            "you choose that particular approach?"
        ),
        "HR": (
            "Can you give me a specific example that demonstrates this "
            "strength in a professional or academic setting?"
        ),
    }

    next_question = follow_up_questions.get(
        request.mode,
        follow_up_questions["Technical"],
    )

    return {
        "feedback": feedback,
        "next_question": next_question,
    }