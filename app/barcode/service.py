from ..repository import Repository
from ..repository.mongo import MongoRepository
from .schema import BarcodeSchema


class Service(object):
    def __init__(self, repo_client=Repository(adapter=MongoRepository)):
        self.repo_client = repo_client

    def find_all_barcodes(self):
        barcodes = self.repo_client.find_all({})
        return [self.dump(barcode) for barcode in barcodes]

    def find_barcode(self, id):
        barcode = self.repo_client.find({'_id': id})
        return self.dump(barcode)

    def create_barcode_for(self, barcode):
        self.repo_client.create(self.prepare_barcode(barcode))
        return self.dump(barcode.data)

    def delete_barcode_for(self, id):
        records_affected = self.repo_client.delete({'_id': id})
        return records_affected > 0

    def dump(self, data):
        return BarcodeSchema().dump(data)

    def prepare_barcode(self, barcode):
        data = barcode.data
        return data
