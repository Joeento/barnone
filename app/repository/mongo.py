import os
from pymongo import MongoClient
from config.default import DefaultConfig

COLLECTION_NAME = 'barcodes'


class MongoRepository(object):
    def __init__(self):
        mongo_url = DefaultConfig().MONGO_URL
        self.db = MongoClient(mongo_url).barnone

    def find_all(self, selector):
        return self.db.barcodes.find(selector)

    def find(self, selector):
        return self.db.barcodes.find_one(selector)

    def create(self, barcode):
        return self.db.barcodes.insert_one(barcode)

    def update(self, selector, barcode):
        return self.db.barcodes.replace_one(selector, barcode).modified_count

    def delete(self, selector):
        return self.db.barcodes.delete_one(selector).deleted_count
