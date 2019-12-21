from pyzbar import pyzbar
import argparse
import cv2

import imutils
import numpy as np

import os

class BarcodeDecoder:

    def __init__(self, filename):
        self.filename = filename

    def extract(self):
        image = cv2.imread(self.filename)
        barcodes = pyzbar.decode(image)

        #if pyzbar fails, try running our homegrown cleaner on the image, and then put it through pyzbar again
        if len(barcodes) == 0:
            blurred_image = self.blur(image)
            barcodes = pyzbar.decode(blurred_image)

        if len(barcodes) == 0:
            return False, False

        return barcodes[0].data.decode("utf-8"), barcodes[0].type

    def blur(self, original_image):
        image = original_image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        kernel_3x3 = np.ones((7, 7), np.float32) * -1
        kernel_3x3[2][2] = 9
        grayZ = cv2.filter2D(gray, -1, kernel_3x3)

        # compute the Scharr gradient magnitude representation of the images
        # in both the x and y direction using OpenCV 2.4
        ddepth = cv2.cv.CV_32F if imutils.is_cv2() else cv2.CV_32F
        gradX = cv2.Sobel(gray, ddepth=ddepth, dx=1, dy=0, ksize=-1)
        gradY = cv2.Sobel(gray, ddepth=ddepth, dx=0, dy=1, ksize=-1)

        # subtract the y-gradient from the x-gradient
        gradient = cv2.subtract(gradX, gradY)
        gradient = cv2.convertScaleAbs(gradient)

        # blur and threshold the image
        b = int(7)
        blurred = cv2.blur(gradient, (b, b))
        (_, thresh) = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)

        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        # perform a series of erosions and dilations
        closed = cv2.erode(closed, None, iterations=4)
        closed = cv2.dilate(closed, None, iterations=4)

        # find the contours in the thresholded image, then sort the contours
        # by their area, keeping only the largest one
        cnts = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        c = sorted(cnts, key=cv2.contourArea, reverse=True)[0]

        # compute the rotated bounding box of the largest contour
        rect = cv2.minAreaRect(c)
        box = cv2.cv.BoxPoints(rect) if imutils.is_cv2() else cv2.boxPoints(rect)
        box = np.int0(box)

        # draw a bounding box arounded the detected barcode and display the
        # image
        cv2.drawContours(image, [box], -1, (0, 255, 0), 3)

        #rotate the image so the barcode is horizontally aliged
        rows, cols, _ = image.shape
        M = cv2.getRotationMatrix2D((cols / 2, rows / 2), rect[2], 1)
        image = cv2.warpAffine(image, M, (cols, rows))

        #add a vertical directional blur
        kernel_size = 100
        kernel_motion_blur = np.zeros((kernel_size, kernel_size))
        kernel_motion_blur[:, int((kernel_size - 1) / 2)] = np.ones(kernel_size)
        kernel_motion_blur = kernel_motion_blur / kernel_size
        image = cv2.filter2D(image, -1, kernel_motion_blur)

        return image
