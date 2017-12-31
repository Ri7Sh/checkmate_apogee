# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

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
		return redirect('minesweeper')

	pass

def register(request):


	pass

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
