from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel 
from models.backend import SessionLocal, engine #importing the database connection
import models.connection as models
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from models.statsEngine import StatsEngine

app = FastAPI()

origins = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    '*'  # Allow all origins for development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="html"), name="static")

class RoundBase(BaseModel):
    f_name: str
    l_name: str
    holes_played: int
    round_score: int
    GIR: int
    putts: int
    date: str

class RoundModel(RoundBase):
    id: int

    class Config:
        orm_mode = True

class RoundResponse(BaseModel):
    round: RoundModel
    stats: dict


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/Round", response_model=RoundResponse)
async def createRound(round_data: RoundBase, db: db_dependency):
    # Save the round to database
    db_round = models.Round(**round_data.dict())
    db.add(db_round)
    db.commit()
    db.refresh(db_round)
    
    # Get all rounds for this player
    all_rounds = db.query(models.Round).filter(
        models.Round.f_name == round_data.f_name,
        models.Round.l_name == round_data.l_name
    ).all()
    
    # Calculate stats
    stats = {}
    if all_rounds:
        scores = [r.round_score for r in all_rounds if r.round_score]
        total_gir = sum([r.GIR for r in all_rounds if r.GIR])
        total_putts = sum([r.putts for r in all_rounds if r.putts])
        rounds_count = len(all_rounds)
        
        stats = {
            "total_rounds": rounds_count,
            "average_score": round(sum(scores) / len(scores), 2) if scores else 0,
            "best_score": min(scores) if scores else 0,
            "worst_score": max(scores) if scores else 0,
            "average_gir": round(total_gir / rounds_count, 2) if rounds_count > 0 else 0,
            "average_putts": round(total_putts / rounds_count, 2) if rounds_count > 0 else 0,
            "last_round_score": round_data.round_score,
            "last_round_gir": round_data.GIR,
            "last_round_putts": round_data.putts
        }
        
        # Calculate handicap if enough rounds (8+)
        if len(scores) >= 8:
            engine = StatsEngine()
            handicap = engine.calculateAverageScores(scores)
            stats["handicap"] = round(handicap, 1) if handicap else None
    
    return {
        "round": db_round,
        "stats": stats
    }

@app.get("/rounds", response_model=List[RoundModel])
async def read_rounds(db: db_dependency, skip: int=0, limit: int = 100):
    rounds = db.query(models.Round).offset(skip).limit(limit).all()
    return rounds