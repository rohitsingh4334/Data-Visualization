from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)


Mongo_Host = 'localhost'
Mongo_Port = 27017
DB_Name = 'mydb'
Collection_Name = 'mycollection'
FIELDS = {"_id": False,"Brand":True,"Starbucks":True,"Store_Name":True,"Ownership_Type":True,
          "Street_Address":True,"City":True,"State/Province":True,"Country":True,"Longitude":True,"Latitude":True}

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/mydb/mycollection")
def getStoresData():
    connection = MongoClient(Mongo_Host,Mongo_Port)
    collection = connection[DB_Name][Collection_Name]
    #print (collection)
    #print(collection.find_one())
    Stores= collection.find(projection = FIELDS)
    json_Stores = []
    for store in Stores:
        json_Stores.append(store)
    json_Stores = json.dumps(json_Stores, default = json_util.default)    
    connection.close()
    return json_Stores    



if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000,debug=True)
