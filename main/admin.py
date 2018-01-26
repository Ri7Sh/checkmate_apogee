# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import UserProfile, Question, PuzzlePc
# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Question)

admin.site.register(PuzzlePc)
