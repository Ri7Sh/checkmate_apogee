
'192100191000129100111111012210000191001910000111123321111000199291191011232322112129921291013931239211019920921101233210110001992000000001392000'
019292110011012323920129001912931292001223239211000192921100111112110000392001110011993111910019223932110011002991001110001232101910000019101110
000293100000000299100011012332101129029910112932139320192129921211223232110191192991000111123321111000019100191000012210111111001921000191001291
011101910000019101232100011100199200110011239322910019111399110011100293000011211111001129291000112932322100292139219100921029323210110011292910



a0b00000000000000000000c00000000000d000000000000e00f000g0000000h0ij00000k0l0m00000000n0o00p0q000r000000000000000000000000000000000s000t000000000
000r0k0e000a0000n0000000t0000l00000b0000o0hf000000000m000000000000i000000000p0j000000000000g00000000q00000000000000000000s0000000000000000000dc0
000000000t000s000000000000000000000000000000000r000q0p00o0n00000000m0l0k00000ji0h0000000g000f000000000000000d00000000000c00000000000000000000b0a
0cd0000000000000000000s00000000000000000000q00000000g000000000000j0p000000000i000000000000m000000000fh0o0000b00000l0000t0000000n0000a000e0k0r000


import os, sys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
	sys.path.append(BASE_DIR)

DEFAULT_QUESTIONS_FILE_PATH = os.path.join(BASE_DIR, "data", "questions.json")

import json


if __name__=="__main__":
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'checkmate.settings')
	print("Setting up Django...")
	import django
	django.setup()

from main.models import Question, Distance

from django.conf import settings
from django.contrib.auth import get_user_model
User=get_user_model()

if __name__=="__main__":
	set_data_from_file(DEFAULT_QUESTIONS_FILE_PATH)
