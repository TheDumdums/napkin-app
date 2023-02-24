from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def index():
  return render_template('index.html')

@app.route('/drive')
def drive():
  return render_template('drive.html')

@app.route('/contact')
def contact():
  return render_template('contact.html')

@app.route('/about')
def about():
  return render_template('about.html')


if __name__ == "__main__":
  app.run(host='0.0.0.0')
