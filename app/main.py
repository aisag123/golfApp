from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel 
from app.models.backend import SessionLocal, engine #importing the database connection
import app.models.connection as models
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models.statsEngine import StatsEngine
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "http://10.49.250.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "html")), name="static")

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

@app.get("/known-holes")
async def get_holes():
    engine = StatsEngine()
    holes = engine.postKnownHoles()
    return holes
