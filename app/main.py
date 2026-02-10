from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List, Optional
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
    FH: Optional[int] = None
    putts: int
    course_name: Optional[str] = None
    rating: Optional[float] = None
    slope: Optional[int] = None
    tee: Optional[str] = None
    differantial: Optional[float] = None
    date: str

class RoundModel(RoundBase):
    id: int

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/Round", response_model=RoundModel)
async def createRound(round: RoundBase, db: db_dependency):
    db_round = models.Round(**round.dict())
    db.add(db_round)
    db.commit()
    db.refresh(db_round)
    return db_round

@app.get("/rounds", response_model=List[RoundModel])
async def read_rounds(db: db_dependency, skip: int=0, limit: int = 100):
    rounds = db.query(models.Round).offset(skip).limit(limit).all()
    return rounds

@app.get("/overall-stats")
async def get_stats(db: db_dependency):
    all_rounds = db.query(models.Round).all()
    stats_engine = StatsEngine()
    stats = stats_engine.calculateOverall(all_rounds)
    return stats

@app.delete("/rounds")
async def delete_all_rounds(db: db_dependency):
    db.query(models.Round).delete()
    db.commit()
    return {"message": "All rounds deleted"}