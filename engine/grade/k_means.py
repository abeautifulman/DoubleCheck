#!usr/bin/env python

import json
import random
from scipy.spatial import distance

class KMeansCluster:

    iteration = 0

    def __init__(self, data):
        self.objects = [{  'name': x,
                           'a': data[x][0],        
                           'b': data[x][1],
                           'c': data[x][2],
                           'd': data[x][3],
                           'grade': None } for x in data.keys()] 

        self.centroids = [{  'a': random.choice([data[vec][0] for vec in data.keys()]),        
                             'b': random.choice([data[vec][1] for vec in data.keys()]), 
                             'c': random.choice([data[vec][2] for vec in data.keys()]), 
                             'd': random.choice([data[vec][3] for vec in data.keys()]), 
                             'grade': grade } for grade in ['A', 'B', 'C', 'D', 'F']] # A, B, C, D, F 

    def find_class(self, point, centroids):
        point_vec    = (point['a'],point['b'],point['c'],point['d'])
        dst = [(distance.euclidean(point_vec, (centroid['a'],centroid['b'],centroid['c'],centroid['d'])), centroid) for centroid in centroids]
        return min(dst, key = lambda x: x[0])

    def update(self):
        for point in self.objects:
            new_class = self.find_class(point, self.centroids)[1] 
            point['grade'] = new_class['grade']

    def recompute_centroids(self):
        for centroid in self.centroids:
            group = [x for x in self.objects if x['grade'] == centroid['grade']]
            centroid['a'] = sum([x['a'] for x in group]) / len([x['a'] for x in group])
            centroid['b'] = sum([x['b'] for x in group]) / len([x['b'] for x in group])
            centroid['c'] = sum([x['c'] for x in group]) / len([x['c'] for x in group])
            centroid['d'] = sum([x['d'] for x in group]) / len([x['d'] for x in group])

with open('training_data/DoubleCheckEssays/vectors.json', 'r') as vectors_json:
    data = json.load(vectors_json)

classifier = KMeansCluster(data)

grades     = [obj["grade"] for obj in classifier.objects]
new_grades = []

run = True
while run == True:
    print classifier.iteration
    grades = [obj["grade"] for obj in classifier.objects]
    classifier.update()
    classifier.recompute_centroids()
    classifier.iteration += 1
    new_grades = [obj["grade"] for obj in classifier.objects]
    if new_grades == grades:
        run = False


def reorder_grades(grades):
    class_vals = {'A': {'sum': 0, 'mean': 0},
                  'B': {'sum': 0, 'mean': 0},
                  'C': {'sum': 0, 'mean': 0},
                  'D': {'sum': 0, 'mean': 0},
                  'F': {'sum': 0, 'mean': 0}
                 }
    for grade in grades:
        class_vals[grade["grade"]]["sum"] += grade['a']+grade['b']+grade['c']
    
    for val in class_vals.keys():
        class_vals[val]["mean"] = class_vals[val]['sum']/len(grades)*3

    class_vals = [(key, class_vals[key]['mean']) for key in class_vals.keys()] 
    # sort the means
#    new_grades = sorted(class_vals, key=lambda x: x['mean'])
    new_grades = {}
    #new_grades['A'].min(class_vals, key = lambda x: x['mean'])
    print(class_vals)
    #print(new_grades)

final_grades = reorder_grades(classifier.objects)
with open("training_data/DoubleCheckEssays/grades.json", "w") as grades_json:
    json.dump(classifier.objects, grades_json)
print "Grades saved!"
