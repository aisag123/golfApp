#created by Aiden Sagaser on 2023-10-05
# stats engine fot the golf app
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

    # def print_summary(self):
    #     info = self.course.GetCourseInfo()
    #     print("player name: " + str(self.player.firstName) + " " + str(self.player.lastName))
    #     print("course info: " + str(self.course.courseName) + " " + str(self.course.location) + " " + str(self.course.coursePar))
    #     print("round summary: " + "holes played: " + str(self.player.holesPlayed) + " score: " + str(self.player.roundScore))

    # Entry point for testing
if __name__ == "__main__":
    engine = StatsEngine()
    engine.setupFinsihedRound()
    engine.print_summary()
    


