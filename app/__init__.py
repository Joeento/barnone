import os

import random
import time
import string
import datetime
from flask import Flask, json, request, make_response
from bson.objectid import ObjectId
from fpdf import FPDF
from werkzeug.utils import secure_filename
import barcode as barcode_builder

from config.default import DefaultConfig
from app.barcode.service import Service as Barcode
from app.decoder.barcodedecoder import BarcodeDecoder
from app.barcode.schema import BarcodeSchema

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'app.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_object(DefaultConfig())
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/api/barcodes", methods=["GET"])
    def index():
        return json_response(Barcode().find_all_barcodes())

    @app.route("/api/barcodes", methods=["POST"])
    def create():
        # check if the post request has the file part
        if 'images[]' not in request.files:
            return json_response({'error': 'file did not upload correctly'}, 422)

        images = request.files.getlist('images[]')
        barcode_counter = 0
        for image in images:
            #Save to temp
            tmp_filename = '/tmp/' + random_string() + '.png'
            file = image
            file.save(tmp_filename)
            #Analyze
            bd = BarcodeDecoder(tmp_filename)
            barcode_value, barcode_type = bd.extract()

            #If a value is extracted
            if barcode_value:
                #Save to db
                data = {}
                data['value'] = barcode_value
                data['upload_time'] = str(datetime.datetime.now())

                barcode = BarcodeSchema().load(json.loads(json.dumps(data)))

                if hasattr(barcode, 'errors'):
                    return json_response({'error': barcode.errors}, 422)

                barcode = Barcode().create_barcode_for(barcode)
                #Move to folder named after ID
                directory = app.config['BARCODE_DIRECTORY'] + barcode['_id']

                os.makedirs(directory)
                filename = secure_filename('source.png')
                os.rename(tmp_filename, os.path.join(directory, filename))

                #Generate barcode image
                image_name = barcode_builder.generate(barcode_type, barcode_value, output=directory + '/result',
                                                      writer=barcode_builder.writer.ImageWriter())
                barcode_counter += 1
            else:
                os.remove(tmp_filename)

        return json_response({
            'images_sent': len(images),
            'barcodes_found': barcode_counter,
            'barcodes': Barcode().find_all_barcodes()
        })

    @app.route("/api/barcode/<string:id>", methods=["GET"])
    def show(id):
        barcode = Barcode().find_barcode(ObjectId(id))
        if barcode:
            return json_response(barcode)
        else:
            return json_response({'error': 'barcode not found'}, 404)

    @app.route("/api/barcode/<string:id>", methods=["DELETE"])
    def delete(id):
        barcode_service = Barcode()
        if barcode_service.delete_barcode_for(ObjectId(id)):
            return json_response({})
        else:
            return json_response({'error': 'barcode not found'}, 404)

    @app.route("/api/barcodes/pdf", methods=["GET"])
    def pdf():
        timestamp = int(round(time.time() * 1000))
        pdf = FPDF()
        pdf.add_page()

        barcode_service = Barcode()
        barcodes = barcode_service.find_all_barcodes()

        image_x = pdf.w / 4
        image_y = 20

        for barcode in barcodes:
            timestamp = int(round(time.time() * 1000))

            directory = app.config['BARCODE_DIRECTORY'] + barcode['_id']
            pdf.image(directory + '/result.png', x=image_x - (app.config['BARCODE_IMAGE_WIDTH'] / 2), y=image_y, w=app.config['BARCODE_IMAGE_WIDTH'])

            image_x += pdf.w / 4
            if image_x >= pdf.w:
                image_x = pdf.w / 4
                image_y += 100
                if image_y >= pdf.h:
                    pdf.add_page()
                    image_y = 20

        response = make_response(pdf.output(dest='S').encode('latin-1'))
        response.headers.set('Content-Disposition', 'attachment', filename='barcodes_' + str(timestamp) + '.pdf')
        response.headers.set('Content-Type', 'application/pdf')
        return response

    # a simple page that says hello
    @app.route('/api/hello')
    def hello():
        return 'Hello, World!'

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')

    return app


def json_response(payload, status=200):
    return (json.dumps(payload), status, {'content-type': 'application/json'})


def random_string():
    return ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)])
