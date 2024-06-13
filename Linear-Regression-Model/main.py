from flask import Flask, request,  flash, jsonify, Response, send_from_directory
from app import readFile, returnColumns, returnColumns2, plotData2, linearModelTest, plotData3, linearModelTest2;
import pandas as pd;
import io
import os
import json
import csv
from io import StringIO
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from sklearn.linear_model import LinearRegression
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
import base64

try:
    from base64 import encodebytes
except ImportError:  # 3+
    from base64 import encodestring as encodebytes
# this is for flask https://www.youtube.com/watch?v=zsYIw6RXjfM


UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}




app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():

    if request.method == 'POST':
        print(request.headers.get("file2"))
        
           
        col = returnColumns2(request.data)

        data = [ {
        "columns" : col, 
        }]

        return data
    return 'no data to share'


@app.route('/upload/regression', methods=['GET', 'POST'])
def upload_regression_file():
    
    if request.method == 'POST':
        print(request.headers.get("independent"))
        ind = request.headers.get("independent")
        dependent = request.headers.get("dependent")
        

        fig, data = plotData3(request.data, ind, dependent)
        
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        body = {
            "pic":output.getvalue(),
            "data": data
        }
        return Response(output.getvalue())

@app.route('/upload/regression/data', methods=['GET', 'POST'])
def upload_regression_data():
    print("hellp")
    if request.method == 'POST':
        print(request.headers.get("independent"))
        ind = request.headers.get("independent")
        dependent = request.headers.get("dependent")
        

        fig, data = plotData3(request.data, ind, dependent)
        
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        body = {
           
            "data": data
        }

        # https://stackoverflow.com/questions/71951208/how-to-create-json-column-in-pandas-dataframe
        # d = data.apply(lambda x: x.apply(lambda y: json.dumps({x.name: y})))

        cols = [ind, dependent, 'Sklearn Bedroom Predictions','Our Model Predictions']
        # https://stackoverflow.com/questions/44413682/python-pandas-dataframe-create-single-json-column-of-multiple-columns-value
        d = data[cols].apply(lambda x: x.to_json(), axis=1)
        #df =    df.drop(cols, axis=1)
        print("hehehehehehe")
        print(d)
        
        
        return d.to_json(), 200


@app.route("/")
def home():
    return "Home"

@app.route("/test")
def jsonTest():
    
    # columns = returnColumns()
    # fig = plotData2()
    # output = io.BytesIO()
    # FigureCanvas(fig).print_png(output)
    # return Response(output.getvalue(), mimetype='image/png')

    # df = pd.DataFrame(columns)
    # print(df)

    data = [ {
            "number" : 15, 
            "name" : "Data Structures and Algorithms", 
            "col": json.dumps(columns)


        },{
            "number" : 15, 
            "name" : "Data Structures and Algorithms",
            "col": json.dumps(columns)
      


         }
    ]
  
    return jsonify(data), 200
     
@app.route("/uploads/<path:name>")
def download_file(name):
    return send_from_directory(
        app.config['UPLOAD_FOLDER'], name, as_attachment=True
    )


# this metthod return the columns that the user wants to use
# user in the frontend should only be allowed to pick to columns 
# we are only comparing two columns 
@app.route("/columns")
def columns():
    

    columns = returnColumns()
    data = [{
            "col": json.dumps(columns)
        }]
  
    return jsonify(data), 200
     
# this basically plots the first part of the data or the init of the data 
@app.route("/plot")
def plotTest():
    
    columns = returnColumns()
    fig = plotData2()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

@app.route("/linear/model/test")
def testingLinearModel():
    print("bob")
    fig = linearModelTest()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=True)