from marshmallow import Schema, fields

class BarcodeSchema(Schema):
    _id = fields.Str()
    value = fields.Str()
    upload_time = fields.DateTime()
