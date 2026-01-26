from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel 
from app.models.backend import SessionLocal, engine #importing the database connection
import app.models.connection as models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://127.0.0.1:8000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)

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