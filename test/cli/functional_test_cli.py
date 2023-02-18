import os
import tempfile
import pytest
from click.testing import CliRunner
from cli import main
import json


runner = CliRunner()

with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
    f.write('''{ "questionnaireID": "QFUNC", "questionnaireTitle": "TEST", "keywords": ["test"],                                          
                "questions": [ {"qID": "P", "qtext": "How are you?", "required": "FALSE", "type": "profile",                                    
                "options": [ {"optID": "O1", "opttxt": "good", "nextqID": "-"}, {"optID": "O2", "opttxt": "bad", "nextqID": "-"} ] } ] }''')
    f.close()
    runner = CliRunner()
    result = runner.invoke(main, ['questionnaire-upd', '--source', f.name, '--format', 'json'])
    os.unlink(f.name)

print("Uploaded a questionnaire with id QFUNC and keyword \"test\".")

print("Questionnaire with id QFUNC should be in the list.")
result = runner.invoke(main, ['questionnaires', '--format', 'csv'])
print(result.output)

print("Keyword test should be in the list.")
result = runner.invoke(main, ['keywords', '--format', 'csv'])
print(result.output)

print("The questionnaire should have one profile question, 'How are you?', that is not required, with id P.")
result = runner.invoke(main, ['questionnaire', '--questionnaire_id', 'QFUNC', '--format', 'csv'])
print(result.output)

print("The question P should have 2 options, good with optID 'O1' and bad with optID 'O2'. There should not be a next question.")
result = runner.invoke(main, ['question', '--questionnaire_id', 'QFUNC', '--question_id', 'P', '--format', 'csv'])
print(result.output)

print("Making two new sessions for the questionnaire.")
result = runner.invoke(main, ['newsession', '--questionnaire_id', 'QFUNC', '--format', 'csv'])
#find session_id
session_id1 = 'S' + ''.join(filter(str.isdigit, result.output))

result = runner.invoke(main, ['newsession', '--questionnaire_id', 'QFUNC', '--format', 'csv'])
#find session_id
session_id2 = 'S' + ''.join(filter(str.isdigit, result.output))

print(f"Answering 'good'(O1) to the question with session {session_id1} and 'bad'(O2) with session {session_id2}.")
result = runner.invoke(main, ['doanswer', '--questionnaire_id', 'QFUNC', '--question_id', 'P', '--session_id', session_id1, '--option_id', 'O1', '--format', 'csv'])
result = runner.invoke(main, ['doanswer', '--questionnaire_id', 'QFUNC', '--question_id', 'P', '--session_id', session_id2, '--option_id', 'O2', '--format', 'csv'])

print(f"The session with id {session_id1} should have one answer(O1), to qID P.")
result = runner.invoke(main, ['getsessionanswers', '--questionnaire_id', 'QFUNC', '--session_id', session_id1, '--format', 'csv'])
print(result.output)

print(f"The question with id P should have 2 answers, one with id O1 from {session_id1} and one with id O2 from {session_id2}.")
result = runner.invoke(main, ['getquestionanswers', '--questionnaire_id', 'QFUNC', '--question_id', 'P', '--format', 'csv'])
print(result.output)

print(f"Deleting questionnaire")
runner.invoke(main, ['deleteq', '--questionnaire_id', 'QFUNC', '--format', 'csv'])

print("The questionnaire with id QFUNC should no longer be in the list.")
result = runner.invoke(main, ['questionnaires', '--format', 'csv'])
print(result.output)