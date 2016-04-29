#!usr/bin/env python

import wikipedia # access and parse data from wikipedia
from glob        import glob # list the contents of directories
from nltk.corpus import wordnet as wn # generate synsets

import click # progress bars

class Topic:
	'''
	Find all text in the wikipedia corpus corresponding to a given topic.
	'''
	def __init__(self, topic):

	    #self.text = self.findTopic(topic)
            self.topic = topic

        def synsets(self, topic):
            # assess wordnet to determine all similar topic to search for
            topics = []
            for syn in wn.synsets(topic):
                for word in [str(lemma.name()) for lemma in wn.synset(syn.name()).lemmas()]:
                    topics.append(word.replace('_',' '))	
            return list(set(topics)) # remove duplicates

	def findTopic(self, topic):
            # search the entire database for the topics
            topics = self.synsets(topic)
            print "searching for:"
            for word in topics:
                print word
            texts = []
            with click.progressbar(glob('wikipedia/*'), label='scanning corpus...') as wikipedia:
                for folder in wikipedia:
                    for wikidump in glob(folder + "/*"):
                        with open(wikidump, 'r') as dump:
                            raw = dump.readlines()
                            for line in raw:
                                for word in topics:
                                    if word in line:
                                        texts.append(line)
	    return texts
        
        def findTopicOnline(self):
            topics = self.synsets(self.topic)
            for topic in topics:
                print wikipedia.summary(topic)
