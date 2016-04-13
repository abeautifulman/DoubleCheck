#!usr/bin/env python

from time     import sleep
from firebase import firebase

class DoubleCheckQueue:

    queue = []
    fb    = firebase.FirebaseApplication('https://doublecheckproject.firebaseio.com', None)  

    def add(self, filepath):
        self.queue.append(filepath)

    def process(self):
        job = queue.pop(0)
        doc = document(raw_input('user: '), job)
        doc.
    



####################################        

queue = DoubleCheckQueue()

if sys.argv[1]:
    queue.add(sys.argv[1])
        
while True:
    #print fb.get('/queue', None)
    #sleep(5)
    queue.process()
