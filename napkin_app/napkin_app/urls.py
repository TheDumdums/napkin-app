"""napkin_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
# imported views
from napkin import views as napkin_views
from login import views as login_views

urlpatterns = [
    path('admin/', admin.site.urls),

    #redirects
    path('postsignIn', login_views.postsignIn), #redirects to homepage after signin
    path('logout', login_views.logout, name="homepage"), #goes from logged in homepage to logged out homepage
    path('postsignUp/', login_views.postsignUp), #redirects to homepage after signup

    #specialized upload 
    path('upload/image/', napkin_views.upload_napkin, name="homepage"), #special url for uploading napkins -> homepage when done
    path('upload/video/', napkin_views.upload_napkin_video, name="homepage"),

    #content
    path('',napkin_views.unlogged_napkin, name="homepage"), #homepage for unsigned in users
    path('signInReturn/',napkin_views.logged_napkin, name="homepage"), #homepage for logged in users
    path('signIn/', login_views.signIn, name="signin"), #the sign in page
    path('signUp/', login_views.signUp, name="signup"), #the sign up page
    path('about/', napkin_views.about, name="aboutpage"), #the about page
    path('view', napkin_views.napkin_view, name="view"), #the view page
    path('SignInAbout/', napkin_views.logged_about, name="aboutpage"), #the about page for logged in users
]