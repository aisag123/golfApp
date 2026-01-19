MAX_HOLES = 18
DEFAULT_PAR = 72


class Course:
    def __init__(self):
        self.courseName = ""
        self.location = ""
        self.coursePar = 0
        self.courseHoles = 0
        self.slopeRating = 0.0
        self.courseRating = 0.0

    def setCourseInfo(self, courseName, location, slope, rating, par, holes):
        self.courseName = courseName
        self.location = location
        self.slopeRating = slope
        self.courseRating = rating
        self.coursePar = par
        self.courseHoles = holes

    def GetCourseInfo(self):
        if self.courseName == "" or self.location == "":
            return None
        else: 
            return {
                "name: ": self.courseName,
                "location: ": self.courseName,
                "slope: ": self.slopeRating,
                "rating: ": self.courseRating,
                "par: ": self.coursePar,
                "holes: ": self.courseHoles
            }