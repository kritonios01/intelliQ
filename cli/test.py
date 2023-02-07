#!/usr/bin/env python3
import json

#csv
'''import pandas
import requests
from io import StringIO

response=requests.get('https://api.intelliq.site/intelliq_api/admin/healthcheck?format=csv')

text=StringIO(response.text)
df=pandas.read_csv(text)
print(df)'''


with open('questionnaire.json', 'r') as source:
		json_data = json.load(source)

		for key in json_data['questions']:
			print(key['qtext'])



