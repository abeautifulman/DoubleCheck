#!usr/bin/env python

from __future__ import division # use floating point division always
from document   import Document # our main class for essay proccessing
from time       import sleep    # try not to get our API key revoked for ATD
from glob       import glob     # unix style path/file management
from json       import dump, load     # save our training vectors to json for K means analysis

class Trainer:

    master_dir    = raw_input("What directory should I train on? ") + "/"
    essay_vectors = {}
    previous_vectors = load('training_data/DoubleCheckEssays/vectors.json')

    def __init__(self):

        for dir_ in glob(self.master_dir + "/*"):
            print "\nProcessing", dir_
            for essay in glob(dir_ + "/*"): # essays nested in subdirs
                if essay not in self.previous_vectors.keys():
                    print "\nDoubleChecking", essay 
                    doc = Document(essay, "Wil")
                    doc.document_to_text(essay, essay) # should probably truncate the first "essay" argument to just the filename
                    doc.preprocess_text()
                    doc.statistics()
                    errors = doc.proofread()
                    err_stats = {'grammar': 0,
                                 'suggestion': 0,
                                 'spelling': 0
                                 }
                    for err in errors:
                        err_stats[err["type"]] += 1
                    token_sentence_ratio = doc.stats['tokens'] / doc.stats['sentences']
                    self.essay_vectors[essay] = [
                                                    err_stats['grammar'], 
                                                    err_stats['suggestion'], 
                                                    err_stats['spelling'], 
                                                    token_sentence_ratio
                                                ]
                    print "Completed " + essay + ". Sleeping..."
                    sleep(10)

    def save_vectors(self):
        with open("training_data/"+self.master_dir+"vectors.json", "w") as training_json:
            dump(self.essay_vectors, training_json)
        print "All training vectors saved!"

print "starting training..."
t = Trainer()
t.save_vectors()
