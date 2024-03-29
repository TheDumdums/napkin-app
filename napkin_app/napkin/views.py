from django.shortcuts import render
from django.http import HttpResponse
import time
import pyrebase
from django.shortcuts import redirect

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

#returns the napkin page, but for non-logged in users. no special arguments passed in.
def unlogged_napkin(request):
    return render(request, 'index.html')

#returns the napkin page, but for logged in users. the username is passed in.
#there is an option for this page to be loaded with other arguments. For example, on completion,
#this method is called, with a confirmation message passed in.
def logged_napkin(request, additional_params=None):
    try:
        uid = request.session['uid']
    except:
        return render(request, 'index.html', status=403)

    name = database.child("profiles").child(uid).child("username").get().val()

    user_params={"username":name}
    napkins = database.child("napkins").child(uid).get().val()
    user_params={"username":name,"napkins":napkins}
    
    if additional_params:
        for k in additional_params.keys():
            user_params[k] = additional_params[k]

    return render(request, 'index.html', user_params)

#given a url with information about a napkin, upload that napkin to whoever's url is in the session data.
#when completed, change the url to a confirmation message. This url will then invoke the next method (upload_complete)
def upload_napkin(request):
    url = request.POST.get('imageURL')
    name = request.POST.get('imagename')
    uid = request.session['uid']
    timestamp = str(int(time.time()))

    database.child("napkins").child(uid).child(timestamp).update({
        "name": name,
        "url": url
    })
    return HttpResponse("Image Uploaded")

def upload_napkin_video(request):
    url = request.POST.get('videoURL')
    name = request.POST.get('videoname')
    uid = request.session['uid']
    timestamp = str(int(time.time()))
    
    database.child("video-napkins").child(uid).child(timestamp).update({
        "name": name,
        "url": url
    })

    return HttpResponse("Video Uploaded")

#gets all the napkins that a user has made in the database, and the user's name, and
#returns a napking viewing page with the prior data as arguments.
def napkin_view(request):
    try:
        uid = request.session['uid']
    except:
        return render(request, 'index.html', status=403)
    
    name = database.child("profiles").child(uid).child("username").get().val()

    napkins = database.child("napkins").child(uid).get().val()
    video_napkins = database.child("video-napkins").child(uid).get().val()
    return render(request, 'view.html', {"username": name, "napkins": napkins, "video_napkins":video_napkins})

#returns the about page.
def about(request):
    return render(request, 'about.html')

#returns about page, but for logged in users
def logged_about(request,additional_params=None):
    try:
        uid = request.session['uid']
    except:
        return render(request, 'about.html', status=403)

    name = database.child("profiles").child(uid).child("username").get().val()

    user_params={"username":name}
    napkins = database.child("napkins").child(uid).get().val()
    user_params={"username":name,"napkins":napkins}
    
    if additional_params:
        for k in additional_params.keys():
            user_params[k] = additional_params[k]

    return render(request, 'about.html', user_params)