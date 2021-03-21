# Barnone
## Web app for fixing damaged or weathered barcodes using machine learning and OpenCV.

*Deployment*
#For python updates
workon barnone-prod
pip install -r requirements.txt
sudo systemctl restart barnone

#For React updates
cd app/client
npm install
npm run build

#For server updates
sudo systemctl restart nginx

### Installation
1) Create a virtual enviornment and install Opencv 4. (Tutorial (here)[ ]https://www.pyimagesearch.com/2018/08/15/how-to-install-opencv-4-on-ubuntu/])
2) Clone the repo onto your machine
4) Install required packages with `pip install -r requirements.txt`
5) Move to React directory with `cd app/client`
6) Install JavaScript packages with `npm install`
7) Start React with `npm start`
8) From root, start the server with `flask run`

TODO:
	Include nginx/wsgi, /etc/systemd/system/barnone.service files in commit
	Commit this README
	Find a way to edit the npm proxy so we can export to pdfs on local
	Fix React crash when a person clicks behind upload modal
	new modal that opens when you click on a zip code
		Shows you the barcode, it's numerical ID, and it's source image
		Gives you the ability to delete barcode from list
	Figure out why barnone.service has to be restarted on server start
		barnone.service is probably loading before mongo's service, hence the Connection Refused Error.  Change the system start order and check it again.
	Page title.