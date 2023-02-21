from flask import Flask
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

classDB=[]

def start():
  classDBFile = open("db.csv")
  for line in classDBFile.readlines():
    line = line.strip("\n")
    eachLine = line.split(",")
    classDB.append(
      {
        "unit" : int(eachLine[0]),
        "schoolClass" : eachLine[1]
      }
    )

@app.route('/search/<unit>')
def byUnit(unit):
  unit = int(unit)
  res=[]
  for schoolClass in classDB:
    if schoolClass["unit"] == unit:
      res.append(schoolClass)
  return json.dumps(res)

@app.route("/hello")
def hello_world():
  return "Practice"

start()

if __name__ == '__main__':
  app.run(host='0.0.0.0')
