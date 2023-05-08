# import useful libraries
import re
import cv2
import pytesseract
import sympy

class ImageProcessor:
    
    def __init__(self, img_path):
        self.img_path = img_path
        self.img = self.load_image()

    def load_image(self):
        """
        Load an image from the specified path.

        Returns:
            img (numpy.ndarray): A BGR image.
        """
        img = cv2.imread(self.img_path)
        if img is None:
            print("Failed to load image.")
        return img

    def preprocess_image(self):
        """
        Preprocess the image by converting to grayscale, applying binary thresholding,
        and inverting the image.

        Returns:
            inverted_img (numpy.ndarray): A preprocessed grayscale image with binary thresholding
            applied and inverted.
        """
        # Convert the image to grayscale
        gray = cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.GaussianBlur(gray, (3, 3), 0)

        # Apply binary thresholding
        threshold_value = 127 # threshold value to be used
        max_value = 255 # maximum value to be assigned for pixel values above threshold
        threshold_type = cv2.THRESH_BINARY # binary thresholding type
        _, binary = cv2.threshold(blur_img, threshold_value, max_value, threshold_type)

        # Invert the image
        inverted_img = cv2.bitwise_not(binary)

        return inverted_img
    
class EquationParser:
    
    def __init__(self):
        self.x_threshold = 5
        self.custom_config_1 = r'-c tessedit_char_whitelist=+-*/=()0123456789xyzO --psm 8 --oem 3'
        self.is_exponent=None
        self.equation = ""
    
    def parse_equation(self, inverted_img):
        """
        Given an inverted grayscale image, identify the bounding boxes around individual characters 
        and return the list of bounding rectangles along with the location of any exponent character(s).

        Args:
            inverted_img (numpy.ndarray): An inverted grayscale image.

        Returns:
            eq_rep (list): A list of tuples where the first tuple elements contains characters in left-to-right order, and second
            tuple elements are boolean telling whether or not that particular character is exponent 
        """

        # Find contours in the thresholded image
        contours, hierarchy = cv2.findContours(inverted_img.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)

        # Extract bounding rectangles for each contour and sort them by x-coordinate
        boundingRects = [cv2.boundingRect(contour) for contour in contours]
        boundingRects.sort()

        outputBoundingRects = []

        # Combine rectangles for characters like "="
        i = 0

        while i < len(boundingRects):

            if i == (len(boundingRects) - 1):  # last element

                outputBoundingRects.append(boundingRects[i])
                break

            else:
                x1, y1, w1, h1 = boundingRects[i]
                x2, y2, w2, h2 = boundingRects[i+1]
                center_x1 = (2*x1 + w1) / 2
                center_x2 = (2*x2 + w2) / 2

                if abs(center_x1 - center_x2) < self.x_threshold:
                    # Combine the two bounding rects into one that takes up maximal space
                    x = min(x1, x2)
                    y = min(y1, y2)
                    w = max(x1 + w1, x2 + w2) - x
                    h = max(y1 + h1, y2 + h2) - y

                    outputBoundingRects.append((x,y,w,h))
                    i += 2  # skip next element

                else:
                    outputBoundingRects.append(boundingRects[i])
                    i += 1

        # Perform additional processing to correct the bounding boxes and detect any exponent characters
        outputBoundingRects = self._correct_bounding_boxes(outputBoundingRects)    
        exponent = self._check_exponent(outputBoundingRects)

        # Iterate through each bounding box and extract text using pytesseract
        equation_parse = []

        for boundingBox, is_exponent in zip(outputBoundingRects, exponent):
            # Get the bounding rectangle
            x, y, w, h = boundingBox

            # Extract text from the region of interest using pytesseract
            roi = inverted_img[y-10:y+h+10, x-10:x+w+10]
            text = pytesseract.image_to_string(roi, config=self.custom_config_1 )
            text = text.rstrip('\n')
            equation_parse.append((text, is_exponent))

        return equation_parse
    
    def _correct_bounding_boxes(self, bounding_boxes):
        """
        This function takes a list of bounding boxes and corrects the height of any
        bounding boxes where the width is much greater than the height, so that they
        become more square-like. The modification is done based on the center point
        of each bounding box.
        """
        corrected_boxes = []
    
        for box in bounding_boxes:
            x, y, w, h = box
            if w / h > 2:
                center_x = (2*x + w) / 2
                center_y = (2*y + h) / 2   
                h = int(w+20)
                w = h
                x = int(center_x - (w / 2))
                y = int(center_y - (h / 2))   
            corrected_boxes.append((x, y, w, h)) 
        return corrected_boxes
    
    def _check_exponent(self, bounding_boxes):
        """
        Checks difference between vertical coordinate y among two bounding boxes.
        
        Args:
            bounding_boxes (list): bounding box to be used for comparison
        Returns:
            boolean: True if according to a condition exponent is recognized. Otherwise returns False.
            
        """
        origin = (bounding_boxes[0][1])-10
        baseline = bounding_boxes[0][1]+bounding_boxes[0][3]+10
        remaining_anchors = [((bounding_box[1]+bounding_box[3]+10),bounding_box[2],bounding_box[3]) for bounding_box in bounding_boxes[1:]]
        mask = [False]
          
        for anchor,w,h in remaining_anchors:
            
            if ((anchor-origin)/(baseline-origin) < 0.65 ) and (w/h < 1.2):
                self.is_exponent = True
            else:
                self.is_exponent = False
                
            mask.append(self.is_exponent)
            
        return mask
    
    def rewritting_equation(self,tuple_list):
        """
        Takes a list of tuples representing a mathematical equation and rewrites it as a string with exponentiation
        represented by double asterisks (i.e. **). Inserts * between adjacent number and variable.
        Args:
            tuple_list(lst): A list of tuples representing a mathematical equation. Each tuple contains an element of the equation as a string and a boolean value indicating whether the element is an exponent or not.
        Returns
            string (str): returns the rewritten equation as a string.
        """
        # Iterate through the list of tuples
        for i in range(len(tuple_list)):
            if i==0:
                self.equation += tuple_list[i][0]
            # Step 2a: If the element is an exponent, append the "**" before an element to equation
            elif tuple_list[i][1]:
                self.equation += "**" + tuple_list[i][0]
                
            # Step 2b: Otherwise, just append the element to equation
            elif tuple_list[i-1][0].isdigit() and (tuple_list[i][0].isalpha() or tuple_list[i][0] == '(')  and i!=0:
                self.equation += "*" + tuple_list[i][0]  
            else: 
                self.equation += tuple_list[i][0]

        return self.equation
    
class Solver:
    
    def __init__(self, eq):
        self.eq = eq
        self.variables = set(re.findall(r'\b[a-zA-Z]+\b', eq))
        self.symbols = self.create_symbols()
        
    def is_polynomial(self):
        """
        Determines if the input is a polynomial equation or not.
        Args:
            eq: list of tuples representing the equation
        Returns: 
            boolean: True if the input is a polynomial equation, False otherwise
        """
        # Loop through each element in the equation
        for el in self.eq:
            # Skip operands and other non-variable/non-numeric characters
            if el[0] in '+-*/^()=':
                continue
            
            # Check if there are any variables in the equation
            elif el[0].isalpha():
                return True
        
        # If none of the above conditions are met, then the equation is not a polynomial
        return False
    
    def create_symbols(self):
        symbols = {}
        
        # create the symbols for the variables
        for var in self.variables:
            symbols[var] = sympy.symbols(var)
        return symbols
    
    def sympy_symbol(self):
        equation = self.eq
        
        # replace the variables in the equation with the symbols
        for var, symbol in self.symbols.items():
            equation = equation.replace(var, str(symbol))
        return equation