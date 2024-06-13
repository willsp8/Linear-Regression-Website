import numpy as np;
from io import StringIO
#how to install numpy 
# https://code.visualstudio.com/docs/python/python-tutorial

import os
import random
import traceback
from pdb import set_trace
import sys
import numpy as np
from abc import ABC, abstractmethod
import traceback
import pandas as pd

import pandas as pd;
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from sklearn.linear_model import LinearRegression


def readFile():
    df = pd.read_csv('california_housing_train.csv')
    df
    print(df)

def returnColumns():
    df = pd.read_csv('california_housing_train.csv')
    return df.columns.tolist() 

def returnColumns2(file):
    #print(file)

    # we get the data from the request body and it should be in bytes
    # next we convert the byte file into a string which is called s 
    s=str(file,'utf-8')

    #here the string is read and coverted to csv 
    data = StringIO(s) 
 
    #here we make pandas reads the csv file 
    df=pd.read_csv(data)

    # we just want the columns 
    return df.columns.tolist() 

def plotData2():
    df = pd.read_csv('california_housing_train.csv')
    
    pop = df['population']
    bedrooms = df['total_bedrooms']
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.scatter(pop, bedrooms)
    # for naming https://stackoverflow.com/questions/6963035/how-to-set-common-axes-labels-for-subplots
    axis.set_xlabel('common xlabel')
    axis.set_ylabel('common ylabel')
   
    return fig

def plotData3(file, ind, dep):
    # we get the data from the request body and it should be in bytes
    # next we convert the byte file into a string which is called s 
    s=str(file,'utf-8')

    #here the string is read and coverted to csv 
    data = StringIO(s) 
 
    #here we make pandas reads the csv file 
    df=pd.read_csv(data)
    
    pop = df[ind]
    bedrooms = df[dep]
    
    pop_np = pop.to_numpy()
    bedrooms_np = bedrooms.to_numpy()
    test_model = {'alpha_hat':1, 'beta_hat':1/2}
    mse1 = mean_squared_error(get_predictions(test_model, pop_np), bedrooms)
    mse1
    

    mase1 = mean_absolute_error(get_predictions(test_model, pop_np), bedrooms)
    print(mse1)
    print(mase1)
    print("wwwwwwwww")

    best_model = get_best_model(pop_np, bedrooms_np)
  


    # pop_np.shape, bedrooms_np.shape
    # print("heyyyy")
    sklearn_model = LinearRegression().fit(pop_np.reshape((len(pop_np), 1)), bedrooms_np)
    sklean_bedroom_predictions = sklearn_model.predict(pop_np.reshape((len(pop_np), 1)))
    
    predictions_df = pd.DataFrame(
        {ind :pop,
        dep: bedrooms,
        'Sklearn Bedroom Predictions': sklean_bedroom_predictions,
        'Our Model Predictions': get_predictions(best_model, pop_np)
        }
    )
    
    print(predictions_df)
    
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.scatter(pop, bedrooms)
    # for naming https://stackoverflow.com/questions/6963035/how-to-set-common-axes-labels-for-subplots
    axis.set_xlabel(ind)
    axis.set_ylabel(dep)
    axis.scatter(pop, sklean_bedroom_predictions)
    return fig, predictions_df


def get_predictions(model, x):
    alpha_hat = model['alpha_hat']
    beta_hat = model['beta_hat']

    return alpha_hat + beta_hat * x

def mean_squared_error(y, y_pred):
    # we can get the average square error 
    # the error is the veritcal distance 
    n = len(y)
    return np.sum(np.square(y-y_pred)) / n 

def mean_absolute_error(y, y_pred):
    n = len(y)
    return np.sum(np.abs(y-y_pred)) / n

def get_best_model(x, y):
    x_bar = np.average(x)
    y_bar = np.average(y)

    top = np.sum((x - x_bar)*(y - y_bar))
    bot = np.sum((x - x_bar)**2)
    beta_hat = top / bot

    alpha_hat = y_bar - beta_hat*x_bar

    model = {
        'alpha_hat': alpha_hat,
        'beta_hat': beta_hat
    }

    return model


def LinearRegression2(file, ind, dep):
    # we get the data from the request body and it should be in bytes
    # next we convert the byte file into a string which is called s 
    s=str(file,'utf-8')

    #here the string is read and coverted to csv 
    data = StringIO(s) 
 
    #here we make pandas reads the csv file 
    df=pd.read_csv(data)


    
    predictions_df = pd.DataFrame({
        ind: ind,
        dep: dep,
        'Sklearn pridtions': sklean_bedroom_predictions})
    

    pop = df[ind]
    bedrooms = df[dep]
    
    pop_np = pop.to_numpy()
    bedrooms_np = bedrooms.to_numpy()

    pop_np.shape, bedrooms_np.shape

    print("heyyyy")
    print(len(pop_np))
    sklearn_model = LinearRegression().fit(pop_np.reshape((len(pop_np), 1)), bedrooms_np)
    sklean_bedroom_predictions = sklearn_model.predict(pop_np.reshape((len(pop_np), 1)))
    sklean_bedroom_predictions.shape

    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.scatter(pop, bedrooms)
    # for naming https://stackoverflow.com/questions/6963035/how-to-set-common-axes-labels-for-subplots
    axis.set_xlabel(ind)
    axis.set_ylabel(dep)
    axis.scatter(pop, sklean_bedroom_predictions)
    return fig
    
def linearModelTest():
    df = pd.read_csv('california_housing_train.csv')
    
    
    pop = df['population']
    bedrooms = df['total_bedrooms']
    #
    
    pop_np = pop.to_numpy()
    bedrooms_np = bedrooms.to_numpy()
    test_model = {'alpha_hat':1, 'beta_hat':1/2}
    mse1 = mean_squared_error(get_predictions(test_model, pop_np), bedrooms)
    mse1
    

    mase1 = mean_absolute_error(get_predictions(test_model, pop_np), bedrooms)
    print(mse1)
    print(mase1)
    print("wwwwwwwww")

    best_model = get_best_model(pop_np, bedrooms_np)
  


    # pop_np.shape, bedrooms_np.shape
    # print("heyyyy")
    sklearn_model = LinearRegression().fit(pop_np.reshape((17000, 1)), bedrooms_np)
    sklean_bedroom_predictions = sklearn_model.predict(pop_np.reshape((17000, 1)))
    
    predictions_df = pd.DataFrame({'Population':pop,
                               'Bedrooms':bedrooms,
                               'Sklearn Bedroom Predictions':sklean_bedroom_predictions,
                               'Our Model Predictions': get_predictions(best_model, pop_np)})
    
    print(predictions_df)
    


    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.scatter(pop, bedrooms)
    # for naming https://stackoverflow.com/questions/6963035/how-to-set-common-axes-labels-for-subplots
    axis.set_xlabel('common xlabel')
    axis.set_ylabel('common ylabel')
    axis.scatter(pop, get_predictions(best_model, pop_np))
    return fig


def linearModelTest2():
    df = pd.read_csv('forestfires.csv')
    
    pop = df['X']
    bedrooms = df['Y']
    
    pop_np = pop.to_numpy()
    bedrooms_np = bedrooms.to_numpy()

    pop_np.shape, bedrooms_np.shape
    print("heyyyy")
    sklearn_model = LinearRegression().fit(pop_np.reshape((len(pop_np), 1)), bedrooms_np)
    sklean_bedroom_predictions = sklearn_model.predict(pop_np.reshape((len(pop_np), 1)))
    sklean_bedroom_predictions.shape

    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    axis.scatter(pop, bedrooms)
    # for naming https://stackoverflow.com/questions/6963035/how-to-set-common-axes-labels-for-subplots
    axis.set_xlabel('common xlabel')
    axis.set_ylabel('common ylabel')
    axis.scatter(pop, sklean_bedroom_predictions)
    return fig




def linearRegression():
    df = pd.read_csv('california_housing_train.csv')
    df
    print(df)



    main_timer = Timer()
    main_timer.start()

    dataset = pd.read_csv('california_housing_train.csv')
    df_trn, df_vld = dataset.load()

    total_points = 0
      
    for info in task_infos:
        task_timer =  Timer()
        task_timer.start()
        try: 
            params = HyperParameters.get_params(info['name'])
            model_kwargs = params.get('model_kwargs', {})
            data_prep_kwargs = params.get('data_prep_kwargs', {})

            if info['name'] == 'OrdinaryLeastSquares':
                feature_names = "RM"
            elif info['name'] == 'PolynomialRegression':
                feature_names = "LSTAT" 
            else:
                use_features = data_prep_kwargs.get('use_features')
                if use_features is None:
                    err = f"use_features argument for {info['name']} can not be none: received {use_features}"
                    raise ValueError(err)
                elif  len(use_features) < 2 :
                    err = f"use_features argument for {info['name']} must have at least 2 features: received {use_features}"
                    raise ValueError(err)
                
                feature_names = data_prep_kwargs['use_features']

            run_model = RunModel(info['model'], model_kwargs)

            
            X_trn, y_trn, X_vld, y_vld = get_cleaned_data(df_trn, df_vld, feature_names, "MEDV")

            trn_scores = run_model.fit(X_trn, y_trn, info['metrics'], pass_y=True)  # Model training
            eval_scores = run_model.evaluate(X_vld, y_vld, info['metrics'], prefix=eval_stage.capitalize()) # Model testing

            info['trn_score'] = trn_scores[info['eval_metric']]
            info['eval_score'] = eval_scores[info['eval_metric']]
            info['successful'] = True
                
        except Exception as e:
            track = traceback.format_exc()
            print("The following exception occurred while executing this test case:\n", track)
        task_timer.stop()
        
        # print("")
        # points = rubric_regression(info['eval_score'], info['threshold'])
        # print(f"Points Earned: {points}")
        # total_points += points

    # print("="*50)
    # print('')
    # main_timer.stop()

    # avg_trn_mse, avg_eval_mse, successful_tests = summary(task_info)
    # task_eval_mse = get_eval_scores(task_info)
    # total_points = int(round(total_points))

    # print(f"MSE averages for {successful_tests} successful tests")
    # print(f"\tAverage Train MSE: {avg_trn_mse}")
    # print("=======================================================")
    # print(f"\tAverage {eval_stage.capitalize()} MSE: {avg_eval_mse}")
    
    # return (total_points, avg_trn_mse, avg_eval_mse, *task_eval_mse)