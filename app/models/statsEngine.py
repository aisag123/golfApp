#created by Aiden Sagaser on 2023-10-05
from sqlalchemy import null
from app.models.course import Course
from app.models.round import Player
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


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
        return self.calculateHandicap( average)
    
    def calculateOverall(self, all_rounds):
        if not all_rounds:
            return {}
        
        scores = [r.round_score for r in all_rounds]
        total_gir = sum([r.GIR for r in all_rounds if r.GIR])
        total_fh = sum([f.FH for f in all_rounds if f.FH])
        all_score = sum([s.round_score for s in all_rounds if s.round_score])
        total_putts = sum([p.putts for p in all_rounds if p.putts])
        round_count = len(all_rounds)

        stats = {
            "total_rounds": round_count,
            "best_score": min(scores), 
            "worst_score": max(scores), 
            "average_score": round(all_score / round_count, 2) if all_score > 0 else 0,
            "average_FH": round(total_fh / round_count, 2) if round_count > 0 else 0,
            "average_GIR": round(total_gir / round_count, 2) if round_count > 0 else 0, 
            "average_putts": round(total_putts / round_count, 2) if round_count > 0 else 0,
        }
        return stats

    def getcourseInfo(self, course_name, tee):
        api_key = os.getenv("API_KEY")
        url = f"https://api.golfcourseapi.com/v1/search?search_query={course_name}"

        headers = {
            "Authorization": f"Key {api_key}"
        }

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if not data["courses"]:
                    print("No courses found")
                    return None
                
                course = data["courses"][0]
                
                # Search for the tee in both male and female tees
                tee_data = None
                for gender in ["male", "female"]:
                    for tee_info in course["tees"].get(gender, []):
                        if tee_info["tee_name"].lower() == tee.lower():
                            tee_data = tee_info
                            break
                    if tee_data:
                        break
                
                if not tee_data:
                    print(f"Tee '{tee}' not found")
                    return None
                
                return {
                    "course_name": course["course_name"],
                    "location": course["location"],
                    "holes": tee_data["number_of_holes"],
                    "par": tee_data["par_total"],
                    "slope": tee_data["slope_rating"],
                    "rating": tee_data["course_rating"]
                }
            else:
                print(f"Error: {response.status_code}")
            return None
        except Exception as e:
            print(f"Error fetching course info: {e}")
            return None

    # Entry point for testing
if __name__ == "__main__":
    engine = StatsEngine()
    # engine.setupFinsihedRound()
    # engine.calculateAverageScores([80, 85, 78, 90, 88, 76, 82, 79])
    data = engine.getcourseInfo("Edgewood Golf Course", "white")
    if data:
        print(f"Course: {data['course_name']}")
        print(f"Par: {data['par']}")
        print(f"Slope: {data['slope']}")
        print(f"Rating: {data['rating']}")
        print(f"Address: {data['location']['address']}")
    else:
        print("No course data found")


