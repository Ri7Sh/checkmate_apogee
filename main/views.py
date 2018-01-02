# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import re

from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404,HttpResponseRedirect, JsonResponse
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.contrib import auth
from django.views import generic
from .forms import *
from django.db import IntegrityError
from django.contrib.auth.models import User
import json
from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.urlresolvers import reverse

from django.contrib.auth import get_user_model
User=get_user_model()


# Create your views here.
def test(request):
	return HttpResponse("Working!!!")

def index(request):
	if not request.user.is_authenticated() :
		return redirect('register')
	else :
		return render(request, 'minesweeper')


def user_login(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/')
	if request.POST:
		form=LoginForm(request.POST)
		if form.is_valid():	
			data=form.cleaned_data
			username = data['name']
			password = data['password']
			user = auth.authenticate(username=username, password=password)
				
			if user is not None:
				if user.is_active:
					login(request,user)
					return HttpResponseRedirect('/')
				
				else:
					state = "Your account is not active, please contact the site admin."
					return render(request,'register.html', {'form':form, 'state':state })
				
			else:
				state = "Your username and/or password were incorrect."
				return render(request,'register.html', {'form':form, 'state':state})
		else:
			return render(request,'register.html', {'form':form, 'state':state})
		
	else:
		form=LoginForm(request.GET)
		return render(request,'register.html', {'form':form})


def register(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/')
	if request.method=='POST': 
		data=request.POST
		up=User()
		up.username=data['name']
		up.set_password(data['password'])
		try:
			up.save()
		except IntegrityError:
			state="Duplicacy in Username"
			return render(request,'register.html',{'state':state})
		up.phone=data['phone']
		if re.match(r"[^@]+@[^@]+\.[^@]+", data['email'])==None:
			state="Invalid Email Address"
			return render(request,'register.html',{'state':state})
		up.email=data['email']
		up.save()
		return HttpResponseRedirect('/login/')
	else:
		form=TeamForm(request.GET)
		return render(request,'register.html',{'form':form})

@login_required	
def minesweeper(request):
	if request.user.is_authenticated():
		user = UserProfile.objects.get(user=request.user)
		
	else:
		return redirect('login')

			
@login_required
def questions(request):
	pass

def instructions(request):
	return render(request, 'instructions')


@login_required
def game_over(request):
	#"You choose to over the game. No turning back."
	pass

@login_required	
def user_logout(request):
	logout(request)
	return render(request, 'index')


def sendPuzzlePcs(request):#this view might be merged later with answer view
	pieces=User.puzzleRetrieved.all()
	data = serializers.serialize("json", pieces)
	return HttpResponse(data,content_type='application/json')

def check(request):#to check the answer of puzzle
	pass
	# here an object list will be received of size 9(have to check this)
	count =0
	truth_value=0
	data = json.loads(request.body.decode('utf-8'))
	for dt in data:
		count+=1
		if count>9: 
			break
		if idno==1 and position ==1:
			truth_value+=1
		if idno==2 and position ==2:
			truth_value+=1
		if idno==3 and position ==3:
			truth_value+=1
		if idno==4 and position ==4:
			truth_value+=1
		if idno==1 and position ==5:
			truth_value+=1
		if idno==1 and position ==6:
			truth_value+=1
		if idno==1 and position ==7:
			truth_value+=1
		if idno==1 and position ==8:
			truth_value+=1
		if idno==1 and position ==9:
			truth_value+=1
	if truth_value==9:
		state="solved"
		request.user.score+=25
	else:
		state="not solved"
	return HttpResponse(state)
	# each object will contain the idno of puzzle pc and where what is its position in the puzzle according to answer given(values will be from 1 to 9)

def checkAnswer(request):
	answer= request.GET.get('anwer')
	pass
