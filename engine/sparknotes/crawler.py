#!usr/bin/env python

from nltk.corpus import wordnet as wn
from bs4 import BeautifulSoup
import requests

class SparknotesCrawler:
    '''
    args:
        search_terms: a list of strings that contain all the terms to search for
    output:
        a list of strings that contains all sparknotes for a given search term
    '''

    def __init__(self, terms):
        # the term to search for
        self.terms = self.synsets(terms)

    def synsets(self, terms):
        print '\ngenerating synsets'
        all_topics = []
        for term in terms:
            print '== looking for words similar to', term
            # first, assess wordnet to determine all similar topics to search for
            topics = []
            for syn in wn.synsets(term):
                for word in [str(lemma.name()) for lemma in wn.synset(syn.name()).lemmas()]:
                    topics.append(word.replace('_',' '))	
            #print "\n==== found"
            #for t in list(set(topics)):
            #    print "======", t
            all_topics += list(set(topics)) # remove duplicates and add to master list
        return all_topics

    def crawl(self, search_link, search_term):
        print "== requesting", search_link.replace(' ','+')
        #sparknotes_search = requests.get(search_link.replace(' ','+'))
        sparknotes_search = requests.get('http://www.sparknotes.com/cs/arrays/intro/summary.html')
        #sparknotes_search = requests.get("http://www.sparknotes.com/search?q=" + search_term)
        soup = BeautifulSoup(sparknotes_search.text, 'html.parser') 

        # for printing
        #html = soup.prettify()
        #html = html.encode('UTF-8')
        print '==============================================================================================='
        #print soup.get_text()

        # find all the links to the individual sparknote pages that correspond to the given topic
        for line in [link for link in soup.find_all('p')]: # if '.html' in link]: [link for link in soup.find_all('a') if search_term in link.text]:
            print '\n'
            print soup.title
            print line.text
            print line.get('href')
            if raw_input('Should I print the a tags? (y/n): ') == 'y':
                print 
            return self.crawl(line.get('href'), search_term)

crawler = SparknotesCrawler(['science'])
for term in crawler.terms:
    print "\ncrawling for", term
    crawler.crawl("http://www.sparknotes.com/search?q=" + term, term)
