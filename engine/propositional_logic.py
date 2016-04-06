#!usr/bin/env python

from nltk import Valuation, Assignment, Model

val = Valuation([('P', True), ('Q', True), ('R', False)])
dom = set()
g   = Assignment(dom)
m   = Model(dom, val)

print 'P:', val['P']
print 'Q:', val['Q']
print 'R:', val['R'], '\n'

print 'P & Q:',    m.evaluate('(P & Q)',  g)
print '-(P & Q):', m.evaluate('-(P & Q)', g)
print '(P & R):',  m.evaluate('(P & R)',  g)
print '(P | R):',  m.evaluate('(p | R)',  g)

 


