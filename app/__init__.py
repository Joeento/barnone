import os

from flask import Flask, json
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
