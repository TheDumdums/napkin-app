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
    # configured the url
    path('',napkin_views.unlogged_napkin, name="homepage"),
    # path('login', login_views.login, name="login"),
    # path('signup', login_views.signup, name="signup"),
    # path('postLogin', login_views.postLogin),
    # path('postSignUp', login_views.postSignUp),
    path('postsignIn', login_views.postsignIn),
    path('signIn/', login_views.signIn, name="signin"),
    path('signUp/', login_views.signUp, name="signup"),
    path('logout/', login_views.logout, name="log"),
    path('postsignUp/', login_views.postsignUp),
]