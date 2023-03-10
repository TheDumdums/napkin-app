from django.shortcuts import render
import pyrebase
from django.http import HttpResponse
from napkin import views as napkin_views
import cv2
import numpy as np
import requests

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

#returns the sign in page.
def signIn(request):
    return render(request,"login.html")

#returns the sign up page.
def signUp(request):
    return render(request,"signup.html")

#changes your session id to be your firebase uid (account specific)
#this is required in order for other services to work.
#when completed, return a logged in napkin page.
def postsignIn(request):
    email=request.POST.get('email')
    password=request.POST.get('pass')
    
    try:
        user=auth.sign_in_with_email_and_password(email,password)
        
        uid=user["localId"]
        request.session['uid']=str(uid)
        
        name = database.child("profiles").child(uid).child("username").get().val()
        print(name)
        return napkin_views.logged_napkin(request)
    except:
        return render(request,"Login.html",{"message":"Invalid credentials."})

#attempts to create an account in firebase.
#if successful, changes your session id to be your firebase uid (account specific)
#this is required in order for other services to work.
#also, adds your username to the realtime database.
#when completed, return a logged in napkin page.
def postsignUp(request):
    email = request.POST.get('email')
    password = request.POST.get('pass')
    name = request.POST.get('name')

    try:
        user=auth.create_user_with_email_and_password(email,password)
        user=auth.sign_in_with_email_and_password(email,password)
        
        uid = user['localId']
        request.session['uid']=str(uid)
        print(uid)

        database.child("profiles").child(uid).update({
            "username": name
        })
    
        return napkin_views.logged_napkin(request)
    except Exception as e:
        print(e)
        return render(request, "signup.html")

#removes the uid from the session.
#returns an unlogged in napkin page.
def logout(request):
    try:
        del request.session['uid']
    except:
        pass
    return napkin_views.unlogged_napkin(request)

#we aren't using opencv in this project.
#probably delete it later.
def opencvtest(request):
    image = cv2.imread("static/images/napkin.jpg",cv2.IMREAD_COLOR)

    cv2.putText(
        img=image,
        text="This text was written to test out opencv.", 
        org=(0,100), 
        fontFace=cv2.FONT_HERSHEY_PLAIN, #font family
        fontScale=1,
        color=(255, 0, 0, 255), #font color
    ) #font stroke
    cv2.imwrite('static/images/output.jpg', image)

    return render(request, "opencv.html")

#A4, not actually using

def requeststest(request):
    resp=requests.get("https://learnpython.com")
    f=open("static/text/test.txt", "a", encoding="utf-8")
    f.write(resp.text)
    return render(request, "requests.html")

