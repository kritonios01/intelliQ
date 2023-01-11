#softeng 2226

import click
import requests as http
import json

@click.group()
def main():
	'''This is the Command Line Interface for intelliQ \n
	All commands require the --format parameter'''


#ola exoun ypoxrewtika to f
@main.command(short_help='No parameters')
def healthcheck():
	click.echo('health')

@main.command(short_help='No parameters')
def resetall():
	click.echo('reset all')

@main.command(short_help='Parameters: --source')
@click.option('--source', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def questionnaire_upd(source, format): # exei provlima me ti pavla
	click.echo('UPD')

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
	click.echo("Return answer")
	with open('getsession.json', 'r') as source:
		json_data = json.load(source)
		for answer in json_data['answers']:
			print(f'{answer["qID"]}: {answer["ans"]}')

@main.command(short_help='Parameters: --questionnaire_id, --question_id')
@click.option('--questionnaire_id', required=True)
@click.option('--question_id', required=True)
@click.option('--format', required=True, type=click.Choice(['json','csv']))
def getquestionanswers(questionnaire_id, question_id, format): 	#isws ginetai kalytera
	'''response=http.get('/getquestionanswers/:{questionnaire_id}/:{question_id}')
	if response.status_code != 200:
		click.echo(f"Error retrieving data (Code: {response.status_code})")
	else:
		json_data=response.json()'''

	#click.echo(f'')
	with open('ex1.json', 'r') as source:
		json_data = json.load(source)
		for answer in json_data['answers']:
			print(answer["ans"])



	'''with open('example1.json', 'r') as source:
		json_data = json.load(source)
		if questionnaire_id in json_data["questionnaireID"]:
			answers=[]
			for i in json_data['questions']:
				if i['qID'] == question_id:
					for j in i['options']:
						answers.append(j['opttxt'])
					break
			click.echo('This question does not exist')
		else: 
			click.echo('This questionnaire does not exist')
		click.echo(f'Question {question_id} found in questionnaire {questionnaire_id} has the following possible answers:')
		for answer in answers:
			print(answer)'''



