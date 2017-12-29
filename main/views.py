# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def test(request):
	return HttpResponse("Working!!!")

def index(request):
	if not request.user.is_authenticated() :
		return redirect('register.html')
	else :
		return render(request, 'main.html')


def login(request):

	pass

def register(request):
	pass
def minesweeper(request):
	pass

def question(request):
	pass
def instructions(request):
	pass
def game_over(request):
	#"You choose to over the game. No turning back."
	pass

	
def logout(request):
	pass