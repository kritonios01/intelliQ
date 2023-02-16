"""
	intelliQ Command Line Interface
	Basic implementation of the CLI application as described in the req. specification of intelliQ
	Usage: Setup virtual environment and run se2226
	Made with the @click package
"""

import os
import click

import pandas as pd
import requests as http

from io import StringIO
from tabulate import tabulate

# Stores the absolute path of the directory containing the script
script_path = os.path.dirname(os.path.realpath(__file__))

# Returns the API base URL using the host stored in the .selected_server file
# This is set using the select-server command
def get_base_url():
	host = 'localhost:9103'
	try:
		with open(script_path + '/.selected_server', 'r') as f:
			saved_host = f.readline()
			if bool(saved_host and saved_host.strip()):
				host = saved_host
	except IOError:
		pass
	return 'https://' + host + '/intelliq_api'

# Used to parse CSV text
def parse_csv(text):
	table = StringIO(text)
	df = pd.read_csv(table, header = None)
	return tabulate(df, tablefmt="outline", showindex = False)

@click.group()
def main():
	'''intelliQ Command Line Interface\n
	All commands require the --format parameter'''

@main.command(short_help='Checks the connection of the API to the database')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def healthcheck(format):
	'''Checks the connection status of the API application to the database server'''

	click.echo('Checking API connection to the database..')
	response=http.get(f'{get_base_url()}/admin/healthcheck?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Removes all data from the system')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetall(format):
	'''Resets the system by removing all data from the database'''

	click.echo('Resetting..')
	response=http.post(f'{get_base_url()}/admin/resetall?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Uploads and inserts or updates questionnaire data to the system')
@click.option('--source', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire_upd(source, format):
	'''Uploads and inserts or updates questionnaire data to the system'''

	try:
		file = {'file': ('file.json', open(source,'r',encoding='utf-8'), 'application/json', {})}
		click.echo('Uploading questionnaire data..')
		response = http.post(f'{get_base_url()}/admin/questionnaire_upd?format={format}', files=file)
		if response.status_code != 200:
			click.echo(f"Error! (Code: {response.status_code})")
		else:
			if(format=='csv'):
				print(parse_csv(response.text))
			else:
				json_data=response.json()
				for key in json_data:
					print(f'{key} --> {json_data[key]}')
	except IOError:
		click.echo('Source file not found!')

@main.command(short_help='Removes all answers given to a questionnaire from the system')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetq(questionnaire_id, format):
	'''Removes all answers given to a questionnaire from the system'''

	click.echo('Resetting questionnaire..')
	response=http.post(f'{get_base_url()}/admin/resetq/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Returns a specific questionnaire''s data')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire(questionnaire_id, format):
	'''Returns all data of a specific questionnaire'''

	click.echo('Fetching questionnaire data..')
	response = http.get(f'{get_base_url()}/questionnaire/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else: 
			json_data=response.json()
			print(f"Title: {json_data['questionnaireTitle']}")
			print('Keywords:', end=' ')
			for word in json_data['keywords']:
				print(word, end=' ')
			print('\nQuestions:')
			for question in json_data['questions']:
				print(f"({question['qID']}) {question['qtext']} [Required? {question['required']}, type: {question['type']}]")

@main.command(short_help='Returns a specific question''s data')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def question(questionnaire_id, question_id, format):
	'''Returns all data of a specific question'''

	click.echo('Fetching question data..')
	response = http.get(f'{get_base_url()}/question/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else: 
			json_data=response.json()
			print(f"Question Title: {json_data['qtext']}")
			print(f"Required? {json_data['required']}")
			print(f"Type: {json_data['type']}")
			print('Options:')
			for key in json_data['options']:
				print(f"({key['optID']}) {key['opttxt']} [Next question: {key['nextqID']}]")

@main.command(short_help='Submits an answer to a question')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--session_id', required=True)
@click.option('--option_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def doanswer(questionnaire_id, question_id, session_id, option_id, format):
	'''Submits an option as the answer given to a question during a specific session'''

	click.echo('Submitting answer..')
	response = http.post(f'{get_base_url()}/doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else: 
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Returns all answers given to a questionnaire during a session')
@click.option('--questionnaire_id', required=True)
@click.option('--session_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getsessionanswers(questionnaire_id, session_id, format):
	'''Returns the answers given to all of a questionnaire''s questions during a specific session'''

	click.echo('Fetching answers..')
	response = http.get(f'{get_base_url()}/getsessionanswers/{questionnaire_id}/{session_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else: 
			json_data=response.json()
			for key in json_data['answers']:
				print(f'{key["qID"]}: {key["ans"]}')

@main.command(short_help='Returns all answers ever given to a specific question')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getquestionanswers(questionnaire_id, question_id, format):
	'''Returns all answers ever given to a specific question over multiple sessions'''

	click.echo('Fetching answers..')
	response = http.get(f'{get_base_url()}/getquestionanswers/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data['answers']:
				print(key["ans"])

"""
	The following commands concern endpoints which are not described in the
	original requirement specification.
	These endpoints are implementation-specific. We decided it was best to
	include them for a greater user experience.
"""

@main.command(short_help='Lists all questionnaires in the system')
@click.option('--keyword', required=False, multiple=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaires(keyword, format):
	'''Lists all questionnaires in the system'''

	click.echo('Fetching questionnaires..')
	response = http.get(f'{get_base_url()}/questionnaires?format={format}' + (('&keyword=' + '&keyword='.join(keyword) if len(keyword) > 1 else '&keyword=' + keyword[0]) if len(keyword) > 0 else ''))
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for questionnaire in json_data:
				print(f'{questionnaire["questionnaireID"]}: {questionnaire["questionnaireTitle"]}')

@main.command(short_help='Creates a new session for a questionnaire')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def newsession(questionnaire_id, format):
	'''Creates a new session for the a questionnaire'''

	click.echo('Creating session..')
	response = http.post(f'{get_base_url()}/newsession/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else: 
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Lists all questionnaire keywords in the system')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def keywords(format):
	'''Lists all questionnaire keywords in the system'''

	click.echo('Fetching keywords..')
	response = http.get(f'{get_base_url()}/keywords?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for keyword in json_data:
				print(f'{keyword["keywordID"]}: {keyword["keywordText"]}')

@main.command(short_help='Returns system usage statistics')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def stats(format):
	'''Returns general system usage statistics'''

	click.echo('Fetching stats..')
	response = http.get(f'{get_base_url()}/stats?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Sets the API server to use for queries')
@click.option('--host', prompt="Please input the desired API server host", required=True)
def set_server(host):
	'''Sets the API server to use for queries'''

	try:
		with open(script_path + '/.selected_server', 'w') as f:
			f.write(host)
	except IOError:
		pass

@main.command(short_help='Deletes a questionnaire from the system')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def deleteq(questionnaire_id, format):
	'''Deletes a questionnaire from the system'''

	click.echo('Deleting questionnaire..')
	response=http.post(f'{get_base_url()}/admin/deleteq/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			print(parse_csv(response.text))
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')