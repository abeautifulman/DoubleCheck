#!usr/bin/env python

import sys
from time     import sleep
from firebase import firebase
from document import Document

class DoubleCheckQueue:

    queue = []
    fb    = firebase.FirebaseApplication('https://doublecheckproject.firebaseio.com', None)  

    def add(self, filepath):
        self.queue.append(filepath)

    def process(self):
        job = self.queue.pop(0)
        doc = Document(job, raw_input('user: '))
        doc.preprocess_text()
        doc.proofread()
        doc.statistics()

####################################        

queue = DoubleCheckQueue()

if sys.argv[1]:
    queue.add(sys.argv[1])
        
while True:
    #print fb.get('/queue', None)
    #sleep(5)
    try:
        queue.process()
    except IndexError:
        sleep(10)
