#softeng 2226 CLI
#Basic implementation of the intelliQ CLI with @click plugin. The basic grouped command is se2226 (see setup.py)
#Here we define the main group and each (sub)command has been implemented below

import os
import click
import requests as http
from io import StringIO
from tabulate import tabulate
import pandas as pd

script_path = os.path.dirname(os.path.realpath(__file__))

def get_base_url():
	try:
		with open(script_path + '/.selected_server', 'r') as f:
			host = f.readline()
			if bool(host and host.strip()):
				return 'https://' + host + '/intelliq_api'
	except IOError:
		pass
	return 'https://api.intelliq.site/intelliq_api'

#helper function
def csv_handling(response):
	table = StringIO(response.text)
	df = pd.read_csv(table, header = None)
	print(tabulate(df, tablefmt="outline", showindex = False))

@click.group()
def main():
	'''This is the Command Line Interface for intelliQ \n
	All commands require the --format parameter'''

@main.command(short_help='Checks end-to-end connectivity between user and database         No parameters')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def healthcheck(format):
	'''Checks end-to-end connectivity between user and database'''

	click.echo('Checking connection with Database...')
	response=http.get(f'{get_base_url()}/admin/healthcheck?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Deletes all data (questionnaires, sessions and answers) from database                                                    No parameters')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetall(format):
	'''Deletes all data (questionnaires, sessions and answers) from database'''

	click.echo('Resetting all...')
	response=http.post(f'{get_base_url()}/admin/resetall?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)		
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Uploads the questionnaire located in source (json file) to the database                                        Parameters: --source')
@click.option('--source', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire_upd(source, format):
	'''Uploads the questionnaire located in source (json file) to the database'''
	
	try:
		file = {'file': ('file.json', open(source,'r'), 'application/json', {})}
		click.echo('Uploading Questionnaire...')
		response = http.post(f'{get_base_url()}/admin/questionnaire_upd?format={format}', files=file)
		if response.status_code != 200:
			click.echo(f"Error! (Code: {response.status_code})")
		else:
			if(format=='csv'):
				csv_handling(response)
			else:
				json_data=response.json()
				for key in json_data:
					print(f'{key} --> {json_data[key]}')
	except IOError:
		click.echo('File Not Found!')

@main.command(short_help='Deletes the selected questionnaire from the database        Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetq(questionnaire_id, format):
	'''Deletes the selected questionnaire from the database'''

	click.echo('Resetting answers...')
	response=http.post(f'{get_base_url()}/admin/resetq/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)			
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Returns the selected questionnaire             Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire(questionnaire_id, format):
	'''Returns the selected questionnaire'''

	click.echo('Fetching data about the questionnaire...')
	response = http.get(f'{get_base_url()}/questionnaire/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else: 
			json_data=response.json()
			print(f"Title: {json_data['questionnaireTitle']}")
			print('Keywords:', end=' ')
			for word in json_data['keywords']:
				print(word, end=' ')
			print('\nQuestions:')
			for question in json_data['questions']:
				print(f"({question['qID']}) {question['qtext']} [Required? {question['required']}, type: {question['type']}]")

@main.command(short_help='Returns the selected question                          Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def question(questionnaire_id, question_id, format):
	'''Returns the selected question'''

	click.echo('Fetching data about the question...')
	response = http.get(f'{get_base_url()}/question/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else: 
			json_data=response.json()
			print(f"Question Title: {json_data['qtext']}")
			print(f"Required? {json_data['required']}")
			print(f"Type: {json_data['type']}")
			print('Options:')
			for key in json_data['options']:
				print(f"({key['optID']}) {key['opttxt']} [Next question: {key['nextqID']}]")

@main.command(short_help='Uploads the answer given to the selected question in a given session                                        Parameters: --questionnaire_id, --question_id, --session_id, --option_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--session_id', required=True)
@click.option('--option_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def doanswer(questionnaire_id, question_id, session_id, option_id, format):
	'''Uploads the answer given to the selected question in a given session'''

	click.echo('Registering answer...')
	response = http.post(f'{get_base_url()}/doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else: 
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Returns the answers to the selected questionnaire in a given session                                      Parameters: --questionnaire_id, --session_id')
@click.option('--questionnaire_id', required=True)
@click.option('--session_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getsessionanswers(questionnaire_id, session_id, format):
	'''Returns the answers to the selected questionnaire in a given session'''

	click.echo('Fetching answers...')
	response = http.get(f'{get_base_url()}/getsessionanswers/{questionnaire_id}/{session_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else: 
			json_data=response.json()
			for key in json_data['answers']:
				print(f'{key["qID"]}: {key["ans"]}')

@main.command(short_help='Returns the answers to the selected question      Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getquestionanswers(questionnaire_id, question_id, format):
	'''Returns the answers to the selected question'''

	click.echo('Fetching answers...')
	response = http.get(f'{get_base_url()}/getquestionanswers/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else:
			json_data=response.json()
			for key in json_data['answers']:
				print(key["ans"])

@main.command(short_help='Returns all the questionnaires related to the given keyword                                             Parameters: --keyword, --question_id')
@click.option('--keyword', required=False, multiple=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaires(keyword, format):
	'''Returns all the questionnaires related to the given keyword'''

	click.echo('Fetching questionnaires...')
	response = http.get(f'{get_base_url()}/questionnaires?format={format}' + (('&keyword=' + '&keyword='.join(keyword) if len(keyword) > 1 else '&keyword=' + keyword[0]) if len(keyword) > 0 else ''))
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else:
			json_data=response.json()
			for questionnaire in json_data:
				print(f'{questionnaire["questionnaireID"]}: {questionnaire["questionnaireTitle"]}')

@main.command(short_help='Creates a new session for the selected questionnaire    Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def newsession(questionnaire_id, format):
	'''Creates a new session for the selected questionnaire'''

	click.echo('Creating new session...')
	response = http.post(f'{get_base_url()}/newsession/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else: 
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Returns all available questionnaire keywords             No parameters')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def keywords(format):
	'''Returns all available questionnaire keywords'''

	click.echo('Fetching keywords...')
	response = http.get(f'{get_base_url()}/keywords?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_handling(response)
		else:
			json_data=response.json()
			for keyword in json_data:
				print(f'{keyword["keywordID"]}: {keyword["keywordText"]}')

@main.command(short_help='Selects API server for querying                       Parameters: --host')
@click.option('--host', prompt=True, required=True, type=click.Choice(['api.intelliq.site:443','localhost:9103']))
def select_server(host):
	'''Selects API server for querying'''

	try:
		with open(script_path + '/.selected_server', 'w') as f:
			f.write(host)
	except IOError:
		pass