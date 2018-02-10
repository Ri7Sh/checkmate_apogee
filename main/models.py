# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
#from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from datetime import timedelta, datetime
from django.utils import timezone
# CustomUser is the extended user model
# Create your models here

class PuzzlePc(models.Model):
	idno = models.IntegerField(default=0)
	pos = models.IntegerField(default=0)
	def __str__(self):
		return str(self.idno)

class UserProfile(AbstractUser):
	#user = models.OneToOneField(User)
	regTime = models.DateTimeField(default=timezone.now())
	time = models.FloatField(default=7200.0)
	score = models.IntegerField(default = 0)
	minesLeft = models.IntegerField(default=20)#
	phone = models.CharField(default='0000000000', max_length=10)
	#question_left = models.IntegerField(default=20)
	mines = models.CharField(max_length=144,default='192100191000129100111111012210000191001910000111123321111000199291191011232322112129921291013931239211019920921101233210110001992000000001392000')
	fieldViewed = models.CharField(max_length=144,default="hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
	puzzleRetrieved = models.ManyToManyField(PuzzlePc)
	puzzlePc = models.IntegerField(default=-1)
	currentQs=models.IntegerField(default=-1)
	quesTry = models.IntegerField(default=0)
	TrialLeft = models.IntegerField(default = 3)
	Puzz = models.CharField(default = "hhhhhhhhhhhh", max_length = 12)
	# quesTry = models.CharField(max_length=20,default="00000000000000000000")#0=no trial 3 = 3 trials
	correctAns = models.CharField(max_length=20,default="00000000000000000000")#0=wrong 2 = correct 1=attempt
	mineno=models.IntegerField(default=0)
	#flag = models.ManyToManyField(flagUsed)
	#flagUsed = model.IntegerField(default=0)
	qslist=models.CharField(max_length=144,default='000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000')

	# def timeLeft(self):
	# 	time = 7200 - (timezone.now()-self.regTime).total_seconds()
	# 	return self.time
		 	


	def __str__(self):
		return self.username

	# def save(self, *args, **kwargs):
	# 	self.time = 7200 - (timezone.now()-self.regTime).total_seconds()
	# 	super(UserProfile,self).save(*args, **kwargs)



class Question(models.Model):
	questionno = models.IntegerField()
	solution = models.CharField(max_length=50)
	question = models.CharField(max_length=10000,default="")
	mineno=models.IntegerField(default=0)
	#puzzlePc = models.IntegerField(default=-1)#contains idno of puzzle pc associated or else -1
	# row=models.IntegerField()
	# col=models.IntegerField()
	idch=models.CharField(max_length=1,default='*')


	def __str__(self):
		return str(self.questionno)+self.idch

class Mines(models.Model):
	idno=models.IntegerField(default=0)
	ques=models.CharField(max_length=144,default="000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
	mines = models.CharField(max_length=144,default='192100191000129100111111012210000191001910000111123321111000199291191011232322112129921291013931239211019920921101233210110001992000000001392000')
