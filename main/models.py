# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User)
	score = models.IntegerField(default = 0)
	mines_left = models.IntegerField(default=20)#
	question_left = models.IntegerField(default=20)
	field_viewed = models.StringField(default="")
	# flag_used = model.IntegerField(default=0)


	def __str__(self):
		return self.teamname

class MinesGame(models.Model):#overview
	user = models.ForeignKey(User)
	
	def minefield(self):
		mines = [1*21001*100012*1001111110122100001*1001*100001111233211110001**2*11*101123232211212**212*1013*3123*21101**20*21101233210110001**20000000013*2000]
		return tuple(mines)


	def ques(self):
		quest = []
		for x in range (0,144):
			if (x/7!= 0):
				quest.append('n')
			else :
				quest.append('q')
		return tuple(quest)

	def __str__(self):
		return



class Question(models.Model):
	pass

class Answer(models.Model):
	pass
