#!usr/bin/env python

from glob        import glob
from nltk.corpus import wordnet as wn

import click 

class Topic:
	'''
	args:
		topic: a string containing the topic to search for
	output:
		find all text in the wikipedia corpus corresponding to a given topic
	'''
	def __init__(self, topic):

		self.text = self.findTopic(topic)

	def findTopic(self, topic):
		'''
		args:
			topic: a string containing the topic
		outputs:
			generates all similar words to the given topic and searches wikipedia for the words
		'''
		# first, assess wordnet to determine all similar topic to search for
		topics = []
		for syn in wn.synsets(topic):
			for word in [str(lemma.name()) for lemma in wn.synset(syn.name()).lemmas()]:
				topics.append(word.replace('_',' '))	
		topics = list(set(topics)) # remove duplicates

		# search the entire database for the topics
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
