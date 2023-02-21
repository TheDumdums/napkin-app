from flask import Flask, jsonify
from flask_cors import CORS

lookup = {}
app = Flask(__name__)
CORS(app)

def startup():
  database = open("names.csv")
  for entry in database.readlines():
    entry = entry.strip("\n")
    line = entry.split(",")
    lookup[line[0]] = line[1]

@app.route('/search/<query>')
def notify_all_subscribers(query):
  try:
    result = lookup[query]
    return jsonify(query+" scored a "+result+" on the test.")
  except KeyError:
    return jsonify(query+" not found in database.")

startup()
  
if __name__ == '__main__':
  app.run(host='0.0.0.0')
