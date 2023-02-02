#softeng 2226

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
				print(f'{key}: {json_data[key]}')

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
				print(f'{key}: {json_data[key]}')


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
					print(f'{key}: {json_data[key]}')
	except IOError:
		click.echo('File Not Found!')

@main.command(short_help='Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def resetq(questionnaire_id, format):
	click.echo('Resets questionnaires')

@main.command(short_help='Parameters: --questionnaire_id')
@click.option('--questionnaire_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire(questionnaire_id, format):
	click.echo('Questionnaire ID')

@main.command(short_help='Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def question(questionnaire_id, question_id, format):
	click.echo("Adds question")

@main.command(short_help='Parameters: --questionnaire_id, --question_id, --session_id, --option_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--session_id', required=True)
@click.option('--option_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def doanswer(questionnaire_id, question_id, session_id, option_id, format):
	click.echo("Adds answer")

@main.command(short_help='Parameters: --questionnaire_id, --session_id')
@click.option('--questionnaire_id', required=True)
@click.option('--session_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getsessionanswers(questionnaire_id, session_id, format):
	click.echo('Fetching Answers...')
	response = http.get(f'/getquestionanswers/{questionnaire_id}/{session_id}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			pass
		else: 
			json_data=response.json()
			for key in json_data['asnwers']:
				print(f'{key["qID"]}: {key["ans"]}')

@main.command(short_help='Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getquestionanswers(questionnaire_id, question_id, format):
	click.echo('Fetching Answers...')
	response = http.get(f'https://api.intelliq.site/intelliq_api/getquestionanswers/{questionnaire_id}/{question_id}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		if(format=='csv'):
			csv_reader = csv.reader(response.text)
			for row in csv_reader:
				print(row)
		else:
			json_data=response.json()
			for key in json_data['asnwers']:
				print(key["ans"])
			

	'''with open('ex1.json', 'r') as source:
		json_data = json.load(source)
		for answer in json_data['answers']:
			print(answer["ans"])'''