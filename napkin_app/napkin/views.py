from django.shortcuts import render
from django.http import HttpResponse
import time
import pyrebase

config = {
    "apiKey": "AIzaSyBm618u4qNxY3SAO_S-DtNfuGT3d5MACRs",
    "authDomain": "napkin-app-46c4a.firebaseapp.com",
    "databaseURL": "https://napkin-app-46c4a-default-rtdb.firebaseio.com",
    "projectId": "napkin-app-46c4a",
    "storageBucket": "napkin-app-46c4a.appspot.com",
    "messagingSenderId": "348724755235",
    "appId": "1:348724755235:web:8cdd35a0ad3e921ba72a96",
    "measurementId": "G-FXEHZFW0B3",
    "serviceAccount": "C:/Users/plunk/Downloads/napkin-app-46c4a-firebase-adminsdk-5ma6a-24d50096c4.json"
}

firebase=pyrebase.initialize_app(config)
auth = firebase.auth()
database = firebase.database()

def unlogged_napkin(request):
    return render(request, 'index.html')

def logged_napkin(request, additional_params=None):
    uid = request.session['uid']
    name = database.child("profiles").child(uid).child("username").get().val()

    napkins = database.child("napkins").child(uid).get().val()
    user_params={"username":name,"napkins":napkins}

    if additional_params:
        for k in additional_params.keys():
            user_params[k] = additional_params[k]

    return render(request, 'index.html', user_params)

def upload_napkin(request, name, uploadURL):
    uploadURL = uploadURL.replace("#", "/")
    uid = request.session['uid']
    timestamp = str(int(time.time()))
    database.child("napkins").child(uid).child(timestamp).update({
        "name": name,
        "url": uploadURL
    })

    return logged_napkin(request, additional_params={"upload_success": "Upload successful!"})

def about(request):
    return render(request, 'about.html')