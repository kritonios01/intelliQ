import os
import tempfile
import pytest
from click.testing import CliRunner
from cli import main

def test_healthcheck_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['healthcheck', '--format', 'json'])
    assert result.exit_code == 0

def test_healthcheck_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['healthcheck', '--format', 'csv'])
    assert result.exit_code == 0

def test_resetall_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['resetall', '--format', 'json'])
    assert result.exit_code == 0

def test_resetall_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['resetall', '--format', 'csv'])
    assert result.exit_code == 0

def test_questionnaire_upd_command_json():
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
        f.write('''{ "questionnaireID": "QTEST", "questionnaireTitle": "TEST", "keywords": ["test"],                                          
                     "questions": [ {"qID": "P00", "qtext": "TEST_TEST_TEST;", "required": "FALSE", "type": "profile",                                    
                     "options": [ {"optID": "P00TXT", "opttxt": "<open string>", "nextqID": "-"} ] } ] }''')
        f.close()
        runner = CliRunner()
        result = runner.invoke(main, ['questionnaire-upd', '--source', f.name, '--format', 'json'])
        os.unlink(f.name)
        assert result.exit_code == 0

def test_questionnaire_upd_command_csv():
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
        f.write('''{ "questionnaireID": "QTEST2", "questionnaireTitle": "TEST", "keywords": ["test"],                                          
                     "questions": [ {"qID": "P00", "qtext": "TEST_TEST_TEST;", "required": "FALSE", "type": "profile",                                    
                     "options": [ {"optID": "P00TXT", "opttxt": "<open string>", "nextqID": "-"} ] } ] }''')
        f.close()
        runner = CliRunner()
        result = runner.invoke(main, ['questionnaire-upd', '--source', f.name, '--format', 'csv'])
        os.unlink(f.name)
        assert result.exit_code == 0

def test_resetq_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['resetq', '--questionnaire_id', 'QTEST', '--format', 'json'])
    assert result.exit_code == 0

def test_resetq_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['resetq', '--questionnaire_id', 'QTEST2', '--format', 'csv'])
    assert result.exit_code == 0

def test_questionnaire_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['questionnaire', '--questionnaire_id', 'QTEST', '--format', 'json'])
    assert result.exit_code == 0

def test_questionnaire_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['questionnaire', '--questionnaire_id', 'QTEST2', '--format', 'csv'])
    assert result.exit_code == 0

def test_question_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['question', '--questionnaire_id', 'QTEST', '--question_id', 'P00', '--format', 'json'])
    assert result.exit_code == 0

def test_question_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['question', '--questionnaire_id', 'QTEST2', '--question_id', 'P00', '--format', 'csv'])
    assert result.exit_code == 0

def test_newsession_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['newsession', '--questionnaire_id', 'QTEST', '--format', 'json'])
    assert result.exit_code == 0

def test_newsession_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['newsession', '--questionnaire_id', 'QTEST2', '--format', 'csv'])
    #global session_id = result.output[session]
    assert result.exit_code == 0

def test_doanswer_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['doanswer', '--questionnaire_id', 'QTEST', '--question_id', 'P00', '--session_id', 'S' , '--option_id', 'P00TXT', '--format', 'json'])
    assert result.exit_code == 0

def test_doanswer_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['doanswer', '--questionnaire_id', 'QTEST2', '--question_id', 'P00', '--session_id', 'S' , '--option_id', 'P00TXT', '--format', 'csv'])
    assert result.exit_code == 0

def test_getsessionanswers_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['getsessionanswers', '--questionnaire_id', 'QTEST', '--session_id', 'S' , '--format', 'json'])
    assert result.exit_code == 0

def test_getsessionanswers_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['getsessionanswers', '--questionnaire_id', 'QTEST2', '--session_id', 'S' , '--format', 'csv'])
    assert result.exit_code == 0

def test_getquestionanswers_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['getquestionanswers', '--questionnaire_id', 'QTEST', '--question_id', 'P00', '--format', 'json'])
    assert result.exit_code == 0

def test_getquestionanswers_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['getquestionanswers', '--questionnaire_id', 'QTEST2', '--question_id', 'P00', '--format', 'csv'])
    assert result.exit_code == 0

def test_questionnaires_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['questionnaires', '--keyword', 'test', '--format', 'json'])
    assert result.exit_code == 0

def test_questionnaires_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['questionnaires', '--keyword', 'test', '--format', 'csv'])
    assert result.exit_code == 0

def test_keywords_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['keywords', '--format', 'json'])
    assert result.exit_code == 0

def test_keywords_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['keywords', '--format', 'csv'])
    assert result.exit_code == 0

def test_stats_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['stats', '--format', 'json'])
    assert result.exit_code == 0

def test_stats_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['stats', '--format', 'csv'])
    assert result.exit_code == 0

def test_set_server_command():
    runner = CliRunner()
    result = runner.invoke(main, ['set-server', '--host', 'api.intelliq.site'])
    assert result.exit_code == 0

def test_deleteq_command_json():
    runner = CliRunner()
    result = runner.invoke(main, ['deleteq', '--questionnaire_id', 'QTEST', '--format', 'json'])
    assert result.exit_code == 0

def test_deleteq_command_csv():
    runner = CliRunner()
    result = runner.invoke(main, ['deleteq', '--questionnaire_id', 'QTEST2', '--format', 'csv'])
    assert result.exit_code == 0