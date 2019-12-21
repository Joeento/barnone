from setuptools import find_packages, setup

setup(
    name='app',
    version='1.0.9',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask',
        'pymongo',
        'marshmallow',
        'fpdf',
        'numpy',
        'python-barcode',
        'pyzbar',
        'imutils',
        'Pillow'
    ],
)
