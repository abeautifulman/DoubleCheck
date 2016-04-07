#!usr/bin/env python

import unittest
from sys import path

path.append('../process/')

from document import Document

class EngineTestCase(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_raw_text_processing(self):
        text = "test"
        with open("../process/tmp_test_file.txt", "w") as test_file:
            test_file.write(text)
        d = Document("tmp_test_file.txt", "testuser")
        self.assertEqual(type(d.raw), type(text), "raw text conversion failed, not correct type")

    def test_stats_processing(self):
        text = "test"
        with open("../process/tmp_test_file.txt", "w") as test_file:
            test_file.write(text)
        d = Document("tmp_test_file.txt", "testuser")
        self.assertEqual(type(d.stats), dict, "stats processing failed, not correct type")

    def test_sentence_tokenizing(self):
        text = "This is a test sentence."
        with open("../process/tmp_test_file.txt", "w") as test_file:
            test_file.write(text)
        d = Document("tmp_test_file.txt", "testuser")
        d.preprocess_text()
        self.assertEqual(d.preprocessed['sentences'], 1, "sentence tokenizing failed, incorrect number of sentences")

    def test_word_tokenizing(self):
        text = "This is a test sentence."
        with open("../process/tmp_test_file.txt", "w") as test_file:
            test_file.write(text)
        d = Document("tmp_test_file.txt", "testuser")
        d.preprocess_text()
        self.assertEqual(d.preprocessed['tokens'], 6, "word tokenizing failed, incorrect number of tokens")

if __name__ == '__main__': unittest.main()
