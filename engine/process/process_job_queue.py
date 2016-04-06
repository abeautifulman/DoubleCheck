#!usr/bin/env python

from time     import sleep
from firebase import firebase

fb = firebase.FirebaseApplication('https://doublecheckproject.firebaseio.com', None)  

while True:
    print fb.get('/queue', None)
    sleep(5)
