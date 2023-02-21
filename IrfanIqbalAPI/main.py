from flask import Flask
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)

companies_db=[]

def start():
  db_file = open("db.csv")
  for line in db_file.readlines():  

    parts = line.split(",")
    companies_db.append(
      {
        "name" : parts[0],
        "salary" : int(parts[1])
      }
    )  


@app.route("/search/<salary>")
def search_by_salary(salary):
    salary = int(salary)
    res=[]
    for company in companies_db:
        if company["salary"]>=salary:
            res.append(company)
    return json.dumps(res)


@app.route("/hello")
def hello_world():
  return "This is a demo HTTP API to find companies by starting salary."

start()

app.run(host = "0.0.0.0")

