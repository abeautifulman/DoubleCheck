#!usr/bin/env python

import json
import random
from scipy.spatial import distance

class KMeansCluster:
    '''
    args:
	data: the vectorized essay information in json format
    output:
	    clusters of essays sorted by grade
    Implements K Means Clustering to grade essays
    '''

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
        '''
        args:
                point: single dictionary in objects class variable
                centroids: class variable containing all centroids
        output:
                expected class of the point
        Uses euclidian distance to find nearest centroid
        '''
        point_vec    = (point['a'],point['b'],point['c'],point['d'])
        dst = [(distance.euclidean(point_vec, (centroid['a'],centroid['b'],centroid['c'],centroid['d'])), centroid) for centroid in centroids]
        return min(dst, key = lambda x: x[0])

    def update(self):
        '''
        args:
                none
        output:
                create new class memberships for all points
        Establishes new class memberships for all essays
        '''	
        for point in self.objects:
            new_class = self.find_class(point, self.centroids)[1] 
            point['grade'] = new_class['grade']
		
    def recompute_centroids(self):
        '''
        args:
                none
        output:
                finds the mean of each dimension for each cluster and updates the centroids with this mean
        '''
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
    grades = [obj["grade"] for obj in classifier.objects]
    classifier.update()
    classifier.recompute_centroids()
    classifier.iteration += 1
    print "iteration:", classifier.iteration, "complete."
    new_grades = [obj["grade"] for obj in classifier.objects]
    if new_grades == grades:
        print "finished!"
        run = False


def reorder_grades(grades):
    '''
    args:
            grades
    output:
            because K Means performs unsupervised clustering, this function sorts the clusters to label them with the correct corresponding grades
    '''
    class_vals = {'A': {'sum': 0, 'mean': 0},
                  'B': {'sum': 0, 'mean': 0},
                  'C': {'sum': 0, 'mean': 0},
                  'D': {'sum': 0, 'mean': 0},
                  'F': {'sum': 0, 'mean': 0}
                 }
    for grade in grades:
        class_vals[grade["grade"]]["sum"] += grade['a']+grade['b']+grade['c']
    
    for val in class_vals.keys():
        class_vals[val]["mean"] = class_vals[val]['sum']/3

    class_vals_list = [(key, class_vals[key]['mean']) for key in class_vals.keys()] 
    # sort the means
#    new_grades = sorted(class_vals, key=lambda x: x['mean'])
    new_grades = sorted(class_vals_list, key = lambda x: x[1])
    correct_grades = ['F','D','C','B','A']
    transfer_fcn = {}
    for class_val, mean in new_grades:
        transfer_fcn[class_val] = correct_grades.pop(0)
       
    for obj in grades:
        obj["grade"] = transfer_fcn[obj["grade"]]
        obj["cluster_mean"] = class_vals[obj["grade"]]["mean"]
    print sorted(grades, key = lambda x: x["grade"])
    return grades

final_grades = reorder_grades(classifier.objects)
with open("training_data/DoubleCheckEssays/grades.json", "w") as grades_json:
    json.dump(final_grades, grades_json)
print "Grades saved!"
