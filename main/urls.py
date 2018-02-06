from django.conf.urls import url
from main import views
urlpatterns = [
	url(r'^$',views.index,name='index'),
	url(r'^login/$',views.user_login, name='login'),
	url(r'^logout/$',views.user_logout,name='logout'),
	url(r'^instructions/$',views.instructions,name='instructions'),
	url(r'^register/$',views.register, name='register'),
	url(r'^test/$',views.test, name='test'),
	url(r'^minesweeper/$',views.minesweeper,name='minesweeper'),
	url(r'^reveal/',views.reveal1,name='questions'),
	url(r'^answer/',views.checkAnswer,name='checkAnswer'),
	url(r'^save/',views.puzzStat,name='Save'),
	url(r'^puzzle/',views.puzzle,name='puzzle'),
	url(r'^check/',views.check,name='check'),
	url(r'^welcome/$',views.welcome,name='welcome'),
	#add any question number here in url


]
