from models.backend import Base #importing the database connection base
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
    FH = Column(Integer)
    putts = Column(Integer)
    date = Column(String)




