#!usr/bin/env python

print "importing libraries..."

# text conversion 
from subprocess import Popen, PIPE
from docx       import opendocx, getdocumenttext
#http://stackoverflow.com/questions/5725278/python-help-using-pdfminer-as-a-library
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout    import LAParams
from pdfminer.pdfpage   import PDFPage
from cStringIO          import StringIO

# natural language processing
from nltk import data, tokenize, pos_tag

# database access
from firebase import firebase

class Document():
	'''
	convert, parse, and operate on input text

	TODO: 
	- [x] support for .pdf, .doc, .docx, and .odt
	- [ ] support for .txt
	- [x] sentence tokenize
	- [ ] paragraph tokenize !!!
	- [x] part of speech tagging
	- [/] writing document to database -- what to include? everything?
	- [ ] LSA? lsa.colorado.edu?
	- [ ] word similarity matrix
	- [x] firebase
	- [ ] word2vec!!   https://radimrehurek.com/gensim/models/word2vec.html --> class gensim.models.word2vec.Word2Vec: Class for training, using and evaluating neural networks described in https://code.google.com/p/word2vec/
	- [ ] wikipedia dumps? (Already have AA through BC... might want to find precompiled set? takes many days to parse all pages from compressed archive)
	- [ ] bigram transformer (process phrases like words) !!
	- [ ] 
		.
		.
		.
	'''
	# establish connection to firebase
	database = firebase.FirebaseApplication('https://grademebaby.firebaseio.com/', None)

	# we might want to train the tokenizer on the format of the input text using PunktSentenceTokenizer(text)
	# these split the document into sentences
	tokenizer     = tokenize.TreebankWordTokenizer()
	sent_detector = data.load('tokenizers/punkt/english.pickle')

	def __init__(self, filename):
		self.filename     = filename # contains extension
		self.raw          = list()   # documentas str 
		self.preprocessed = dict()   # text converted into ( word, lemma, [POS] ) format
		self.stats        = dict()

	def convert_pdf_to_txt(self, path):
		rsrcmgr     = PDFResourceManager()
		retstr      = StringIO()
		codec       = 'utf-8'
		laparams    = LAParams()
		device      = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
		fp          = file(path, 'rb')
		interpreter = PDFPageInterpreter(rsrcmgr, device)
		password    = ""
		maxpages    = 0
		caching     = True
		pagenos     = set()

		map(interpreter.process_page, [page for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True)])
  
  		fp.close()
    		device.close()
    		str = retstr.getvalue()
    		retstr.close()
    		return str

	def document_to_text(self, filename, file_path):
		if filename[-4:] == ".doc":
        		cmd            = ['antiword', file_path]
        		p              = Popen(cmd, stdout=PIPE)
        		stdout, stderr = p.communicate()
        		self.raw       = stdout.decode('ascii', 'ignore')
    		
		elif filename[-5:] == ".docx":
        		document        = opendocx(file_path)
        		paratextlist    = getdocumenttext(document)
        		newparatextlist = []
        		for paratext in paratextlist:
        			 newparatextlist.append(paratext.encode("utf-8"))
       			self.raw = '\n\n'.join(newparatextlist)
    		
		elif filename[-4:] == ".odt":
        		cmd            = ['odt2txt', file_path]
        		p              = Popen(cmd, stdout=PIPE)
        		stdout, stderr = p.communicate()
        		self.raw       = stdout.decode('ascii', 'ignore')
    	
		elif filename[-4:] == ".pdf":
        		self.raw = self.convert_pdf_to_txt(file_path)

	def preprocess_text(self):
		sentences = self.sent_detector.tokenize(self.raw.decode('utf-8').strip())
		tokens    = [self.tokenizer.tokenize(sentence) for sentence in sentences]		
		pos       = [pos_tag(token) for token in tokens]
		
		# final format includes 1) token, 2) lemma, and 3) list of part of speech tags		
		pos = [[(word, word, [postag]) for (word, postag) in sentence] for sentence in pos]		

		self.preprocessed = { 'sentences': sentences,
				      'tokens'   : tokens,
				      'pos'      : pos }

	def statistics(self):
		self.stats['sentences'] = len(self.preprocessed['sentences'])
		self.stats['tokens']    = len(self.preprocessed['tokens'])

def main():
	user     = raw_input('user: ')
	filename = raw_input('filename: ') 
	name     = filename[:-5]

	doc = Document(filename)

	# check to see if the file is already in the database
	user_files = doc.database.get('/documents/' + user, None)
	if name in user_files.keys():
		print "loading document from database..."
		doc.raw          = user_files[name].keys()[0]['raw'] # complicated syntax to bypass random key generation :(
		doc.preprocessed = user_files[name].keys()[0]['tagged'] 
		doc.stats        = user_files[name].keys()[0]['stats']
	
	else:
		print "converting document to raw text..."
		doc.document_to_text(doc.filename, doc.filename)
		print "preprocessing raw text..."
		doc.preprocess_text()
		print "getting document statistics..."
		doc.statistics()
		
		db_entry = { "filename": doc.filename,
		     	     "raw":      doc.raw,
		     	     "tagged":   doc.preprocessed,
		     	     "stats":    doc.stats }	

		doc.database.post('/documents/' + user + "/" + name, db_entry) 	

if __name__=="__main__": main()
