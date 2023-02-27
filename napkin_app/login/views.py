from django.shortcuts import render
import pyrebase
from django.http import HttpResponse
from napkin import views as napkin_views

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

def signIn(request):
    return render(request,"login.html")

def signUp(request):
    return render(request,"signup.html")
 
def postsignIn(request):
    email=request.POST.get('email')
    password=request.POST.get('pass')
    
    try:
        user=auth.sign_in_with_email_and_password(email,password)
        
        session_id=user['idToken']
        uid=user["localId"]
        request.session['uid']=str(session_id)
        
        name = database.child("profiles").child(uid).child("username").get().val()
        print(name)
        return napkin_views.logged_napkin(request, user_params={"username":name})
    except:
        message="Invalid credentials."
        return render(request,"Login.html",{"message":message})

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
    
        return napkin_views.logged_napkin(request, user_params={"username":name})
    except Exception as e:
        print(e)
        return render(request, "signup.html")

def logout(request):
    try:
        del request.session['uid']
    except:
        pass
    return render(request,"login.html")
