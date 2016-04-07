#!usr/bin/env python

import unittest

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
        d = Document(user, text)
        self.assertEqual(d.raw, text, "raw text conversion failed")

if __name__ == '__main__': unittest.main()
