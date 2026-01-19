MIN_PUTTS = 18

class Player:
    def __init__(self):
        self.firstName = ""
        self.lastName = ""
        self.holesPlayed = 0
        self.roundScore = 0
        self.GIR = 0
        self.FH = 0
        self.putts = 0


    def SetPlayerName(self, first, last):
        self.firstName = first
        self.lastName = last
    
    def GetPlayerName(self):
        return
    
    def SetHolesPlayed(self, holes):
        self.holesPlayed = holes
    
    def GetHolesPlayed(self):
        return
        
    def SetRoundScore(self, score):
        self.roundScore = score
    
    def GetRoundScore(self):
        return
    
    def SetGIR(self, gir): 
        self.GIR = gir

    def GetGIR(self):
        return

    def SetPutts(self, putts):
        self.putts = putts