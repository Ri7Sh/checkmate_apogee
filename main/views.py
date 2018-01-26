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
from django.utils import timezone
import json
from datetime import timedelta, datetime
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
		return render(request,'minesweeper.html',{'field':request.user.fieldViewed,'score':request.user.score,'mines':request.user.minesLeft})


def user_login(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect('/')
	if request.POST:
			
			data=request.POST
			username = data['name']
			password = data['password']
			user = auth.authenticate(username=username, password=password)
				
			if user is not None:
				if user.is_active:
					login(request,user)
					return HttpResponseRedirect('/')
				
				else:
					state = "Your account is not active, please contact the site admin."
					return render(request,'register.html', { 'state':state })
				
			else:
				state = "Your username and/or password were incorrect."
				return render(request,'register.html', {'state':state})
		
		
	else:
		return render(request, 'login.html')


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
		#up.regTime = timezone.now()
		up.save()
		return HttpResponseRedirect('/main/login')
	else:
		# return HttpResponseRedirect('/')
		return render(request, 'register.html')


@login_required	
def minesweeper(request):
	#if(request.user.quesDone>=20):
	#	return HttpResponseRedirect('puzzle.html')
	return render({'field':request.user.fieldViewed,'score':request.user.score,'mines':request.user.minesLeft})

def replacindex(text,index=0,replacement=''):
	return '%s%s%s'%(text[:index],replacement,text[index+1:])

	#function
def reveal1(request):
	if request.POST:
		dt= json.loads(request.body.decode('utf-8'))
		cords= dt['cords']
		x = int(cords[1])
		y = int(cords[0])

		reveal(request,x,y,request.user.mines)
		user= request.user
		if user.currentQs!= -1:
				if user.correctAns[user.currentQs]==0:
					qlist=Question.objects.get(questionno=user.currentQs)
					return JsonResponse({'field':request.user.fieldViewed,'qsObject':qList,'score':request.user.score,'mines':request.user.minesLeft})
			#frontend needs to check of qlist contains an qs object or not. qlist is a queryset
		return JsonResponse({'field':request.user.fieldViewed, 'qsObject':'','score':request.user.score,'mines':request.user.minesLeft})






def reveal(request,x,y,mines):
		#mines=request.user.mines
		if((x>=0) and (x<12) and (y>=0) and (y<12)):
			qL=Question.objects.filter(row=x,col=y)
			
			if qL:
				qList=Question.objects.get(row=x,col=y)
				request.user.currentQs=qList.questionno
				request.user.questDone+=1
			if(mines[x*12+y] == '0') :
				# if x-1 in range(11):
				# for i in range (-1,1):
				# 	for j in range(-1,1):
				# 		if(i != 0 and j!=0):						
				# 			reveal(request,x+i,y+j,mines)
				reveal(request,x - 1, y - 1, mines)
				reveal(request,x-1,y,mines)
				reveal(request,x-1,y+1,mines)
				reveal(request,x+1,y,mines)
				reveal(request,x,y-1,mines)
				reveal(request,x,y+1,mines)
				reveal(request,x+1,y-1,mines)
				reveal(request,x+1,y+1,mines)

			elif(mines[x*12+y] == '9'):
				request.user.score-=10
				request.user.minesLeft-=1
			request.user.fieldViewed =replacindex(request.user.fieldViewed,x*12+y,request.user.mines[x*12+y])
			request.user.save()
		
			#frontend needs to check of qlist contains an qs object or not. qlist is a queryset


	

		 
@login_required	
def user_logout(request):
	logout(request)
	return redirect('login')



@login_required
def sendPuzzlePcs(request):#this view might be merged later with answer view
	pieces=User.puzzleRetrieved.all()
	data = serializers.serialize("json", pieces)
	return HttpResponse(data,content_type='application/json')


def puzzStat(request):
	if request.POST:
		dt= json.loads(request.body.decode('utf-8'))
		for i in range(12):
			if(dt[i] != 'null'):
				if(request.user.Puzz[i]=='h'):
					request.user.Puzz[i]=dt[i]
					
		request.user.save()		



@login_required
def check(request):#to check the answer of puzzle
	if request.user.quesTry < 20:
		status = "Solve all questions first"
		return JsonResponse({'score':request.user.score,'status':status, 'TrialLeft' : TrialLeft})
	if request.user.TrialLeft < 1 :
		status = "No trial left"
		return JsonResponse({'score':request.user.score,'status':status, 'TrialLeft' : TrialLeft})
	# here an object list will be received of size 9(have to check this)
	if request.POST:
		puzzStat(request)
		request.user.TrialLeft-=1
		truth_value = 0
		for i in range(12):
			pc = PuzzlePc.objects.get(pos = i)
			if (request.user.Puzz[i] == pc.idno):
				truth_value+=1
		if truth_value==9:
			state="solved"
			request.user.score+=25#json reponese - score

		else:

			state="not solved"
	
		request.user.save()	
		return JsonResponse({'score':request.user.score,'status':state, 'TrialLeft' : TrialLeft})
	

	# count =0
	# truth_value=0
	# data = json.loads(request.body.decode('utf-8'))
	# for dt in data:

	# 	count+=1
	# 	if count>9: 
	# 		break
	# 	if idno==1 and position ==1:
	# 		truth_value+=1
	# 	if idno==2 and position ==2:
	# 		truth_value+=1
	# 	if idno==3 and position ==3:
	# 		truth_value+=1
	# 	if idno==4 and position ==4:
	# 		truth_value+=1
	# 	if idno==1 and position ==5:
	# 		truth_value+=1
	# 	if idno==1 and position ==6:
	# 		truth_value+=1
	# 	if idno==1 and position ==7:
	# 		truth_value+=1
	# 	if idno==1 and position ==8:
	# 		truth_value+=1
	# 	if idno==1 and position ==9:
	# 		truth_value+=1
	# each object will contain the idno of puzzle pc and where what is its position in the puzzle according to answer given(values will be from 1 to 9)

def checkAnswer(request):
	answer= request.GET.get('answer')
	# attempt = request.user.correctAns()
	qsno=request.user.currentQs
	request.user.correctAns[qsno] = 1
	qs=Question.objects.get(questionno=qsno)
	if qs.solution==answer:
		request.user.correctAns[qsno] = 2
		request.user.score+=50
		request.user.puzzlePc+=1
		request.user.Puzz[request.user.puzzlePc] = 'n'
		#Pc=PuzzlePc.objects.get(id=request.user.puzzlePc)
		#request.user.puzzleRetrieved.add(Pc)
	# 	request.user.save()
	# 	#return JsonResponse({'score':request.user.score,'puzzleOb':pc,'status':"correct",'quesDone':request.user.quesTry})
	# 	return JsonResponse({'score':request.user.score,'puzzle':request.user.Puzz,'status':"correct",'quesDone':request.user.quesTry})

	# else:
	# 	request.user.save()
	# 	return JsonResponse({'status':"wrong",'quesDone':request.user.quesTry})
	request.user.save()
	return JsonResponse({'score':request.user.score,'puzzle':request.user.Puzz,'status':"correct",'quesDone':request.user.quesTry})


def instructions(request):
	return HttpResponse("<body><h1>Hello</h1></body>")

