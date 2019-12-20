import os

import time
from flask import Flask, json
from bson.objectid import ObjectId
from fpdf import FPDF

from app.barcode.service import Service as Barcode

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'app.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile(os.path.join(os.getcwd(), 'config/default.py'), silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/barcodes", methods=["GET"])
    def index():
        return json_response(Barcode().find_all_barcodes())

    @app.route("/barcode/<string:id>", methods=["GET"])
    def show(id):
        barcode = Barcode().find_barcode(ObjectId(id))
        if barcode:
            return json_response(barcode)
        else:
            return json_response({'error': 'barcode not found'}, 404)


    @app.route("/barcode/<string:id>", methods=["DELETE"])
    def delete(id):
        barcode_service = Barcode()
        if barcode_service.delete_barcode_for(ObjectId(id)):
            return json_response({})
        else:
            return json_response({'error': 'barcode not found'}, 404)

    @app.route("/barcodes/pdf", methods=["GET"])
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

            directory = app.config['BARCODE_DIRECTORY'] + '/' + barcode['_id']
            pdf.image(directory  + '/result.png', x=image_x - (app.config['BARCODE_IMAGE_WIDTH'] / 2), y=image_y, w=app.config['BARCODE_IMAGE_WIDTH'])

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
    @app.route('/hello')
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
