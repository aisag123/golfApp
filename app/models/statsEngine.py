#created by Aiden Sagaser on 2023-10-05
# stats engine fot the golf app
from sqlalchemy import null
from app.models.course import Course
from app.models.player import Player

class StatsEngine:
    #(best 8 / 20? - Course Rating) x 113 / Slope Rating
    def __init__(self):
        self.course = Course()
        self.player = Player()

    def setupFinsihedRound(self):
        self.course.setCourseInfo("Edgewood", "Fargo", 0, 0, 72, 18)
        self.player.SetPlayerName("Aiden", "Sagaser")
        self.player.SetHolesPlayed(18)
        self.player.SetRoundScore(80)

    
    def calculateHandicap(self, courseRating, slope, average):
        #call function to calculate average best 8 of 20
        if (courseRating is None or slope is None):
            print("Course rating and slope must be provided")
            return None
        handicap = (average - courseRating) * 113 / slope 
        print("Calculated handicap: ", handicap)
        return handicap
    
    #this will grab from the database later
    def calculateAverageScores(self, scores: list[int]):
        if len(scores) < 8:
            print("Not enough scores to calculate an accurate handicap")
            return None
        else:
            sortedScores = sorted(scores)
            bestEightScores = sortedScores[:8]
            average = sum(bestEightScores) / 8
            print("Average of best 8 scores: ", average)
        return self.calculateHandicap(69.7, 125, average)

    # Entry point for testing
if __name__ == "__main__":
    engine = StatsEngine()
    # engine.setupFinsihedRound()
    engine.calculateAverageScores([80, 85, 78, 90, 88, 76, 82, 79])



