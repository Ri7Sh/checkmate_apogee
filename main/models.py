# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User)
	score = models.IntegerField(default = 0)


	def __str__(self):
		return self.teamname

class MinesGame(models.Model):
	user = models.ForeignKey(User)
	mines_left = models.IntegerField(default=10)#

	def minefield(self):
		mines = []
		for x in range(0, 12):
			row = []



class Question(models.Model):
	pass

class Answer(models.Model):
	pass
