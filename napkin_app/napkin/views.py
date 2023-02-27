from django.shortcuts import render
from django.http import HttpResponse
import pyrebase

def unlogged_napkin(request):
    return render(request, 'index.html')

def logged_napkin(request, user_params):
    return render(request, 'index.html', user_params)