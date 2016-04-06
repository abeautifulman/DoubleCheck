#!usr/bin/env python

import json

with open('training_data/DoubleCheckEssays/grades.json', 'r') as grades_json:
    grades = json.load(grades_json)

grades = sorted(grades, key = lambda x: x['grade'])

for grade in grades:
    print '\n'
    print grade['name']
    print grade['grade']
