#softeng 2226 CLI
#Basic implementation of the intelliQ CLI with @click plugin. The basic grouped command is se2226 (see setup.py)
#Here we define the main group and each (sub)command has been implemented below

import click
import requests as http
import json
import csv

@click.group()
def main():
	'''This is the Command Line Interface for intelliQ \n
	All commands require the --format parameter'''



@main.command(short_help='No parameters')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def healthcheck(format):
	click.echo('Checking connection with Database...')
	response=http.get(f'https://api.intelliq.site/intelliq_api/admin/healthcheck?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):             
			csv_reader = csv.reader(response.text)
			for row in csv_reader:
				print(row)
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='No parameters')
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetall(format):
	click.echo('Resetting all...')
	response=http.post(f'https://api.intelliq.site/intelliq_api/admin/resetall?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass			
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Parameters: --source')
@click.option('--source', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire_upd(source, format):
	try:
		file = {'file': ('file.json', open(source,'r'), 'application/json', {})}
		click.echo('Uploading Questionnaire...')
		response = http.post(f'https://api.intelliq.site/intelliq_api/admin/questionnaire_upd?format={format}', files=file)
		if response.status_code != 200:
			click.echo(f"Error! (Code: {response.status_code})")
		else:
			if(format=='csv'):
				pass
			else:
				json_data=response.json()
				for key in json_data:
					print(f'{key} --> {json_data[key]}')
	except IOError:
		click.echo('File Not Found!')

@main.command(short_help='Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetq(questionnaire_id, format):
	click.echo('Resetting answers...')
	response=http.post(f'https://api.intelliq.site/intelliq_api/admin/resetq/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error! (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass			
		else:
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')

@main.command(short_help='Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire(questionnaire_id, format):
	click.echo('Fetching data about the questionnaire...')
	response = http.get(f'https://api.intelliq.site/intelliq_api/questionnaire/{questionnaire_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass
		else: 
			json_data=response.json()
			print(f"Title: {json_data['questionnaireTitle']}")
			print('Keywords:', end=' ')
			for word in json_data['keywords']:
				print(word, end=' ')
			print('\nQuestions:')
			for question in json_data['questions']:
				print(f"({question['qID']}) {question['qtext']} [Required? {question['required']}, type: {question['type']}]")


@main.command(short_help='Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def question(questionnaire_id, question_id, format):
	click.echo('Fetching data about the question...')
	response = http.get(f'https://api.intelliq.site/intelliq_api/question/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass
		else: 
			json_data=response.json()
			print(f"Question Title: {json_data['qtext']}")
			print(f"Required? {json_data['required']}")
			print(f"Type: {json_data['type']}")
			print('Options:')
			for key in json_data['options']:
				print(f"({key['optID']}) {key['opttxt']} [Next question: {key['nextqID']}]")

@main.command(short_help='Parameters: --questionnaire_id, --question_id, --session_id, --option_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--session_id', required=True)
@click.option('--option_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def doanswer(questionnaire_id, question_id, session_id, option_id, format):
	click.echo('Registering answer...')
	response = http.post(f'https://api.intelliq.site/intelliq_api/doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass
		else: 
			json_data=response.json()
			for key in json_data:
				print(f'{key} --> {json_data[key]}')
			

@main.command(short_help='Parameters: --questionnaire_id, --session_id')
@click.option('--questionnaire_id', required=True)
@click.option('--session_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getsessionanswers(questionnaire_id, session_id, format):
	click.echo('Fetching answers...')
	response = http.get(f'https://api.intelliq.site/intelliq_api/getsessionanswers/{questionnaire_id}/{session_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass
		else: 
			json_data=response.json()
			for key in json_data['answers']:
				print(f'{key["qID"]}: {key["ans"]}')

@main.command(short_help='Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getquestionanswers(questionnaire_id, question_id, format):
	click.echo('Fetching answers...')
	response = http.get(f'https://api.intelliq.site/intelliq_api/getquestionanswers/{questionnaire_id}/{question_id}?format={format}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_reader = csv.reader(response.text)
			for row in csv_reader:
				print(row)
		else:
			json_data=response.json()
			for key in json_data['answers']:
				print(key["ans"])