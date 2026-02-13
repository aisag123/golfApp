from app.models.backend import Base #importing the database connection base
from sqlalchemy import Boolean, Column, Integer, String, Float

    # firstName 
    # lastName 
    # holesPlayed
    # roundScore 
    # GIR 
    # FH
    # putts
    # date

class Round(Base): #this is setting up a players round saved to the DB
    __tablename__ = 'round'

    id = Column(Integer, primary_key=True, index=True)
    f_name = Column(String)
    l_name = Column(String)
    holes_played = Column(Integer)
    round_score = Column(Integer)
    GIR = Column(Integer)
    FH = Column(Integer, nullable=True)
    putts = Column(Integer)
    course_name = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    slope = Column(Integer, nullable=True)
    tee = Column(String, nullable=True)
    differantial = Column(Float, nullable=True)
    date = Column(String)




