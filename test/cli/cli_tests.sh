#!/bin/bash

echo -e "HEALTHCHECK TEST \n"
sleep 0.5
se2226 healthcheck --format json
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE TEST \n"
sleep 0.5
se2226 questionnaire --questionnaire_id QQ001 --format csv
echo "Press any key to continue..."
read x

echo -e "DOANSWER TEST \n"
sleep 0.5
se2226 doanswer --questionnaire_id QQ001 --question_id P00 --session_id  --option_id P00A2 --format json
echo "Press any key to continue..."
read x
se2226 doanswer --questionnaire_id QQ001 --question_id P02 --session_id  --option_id P02A1 --format json
echo "Press any key to continue..."
read x
se2226 doanswer --questionnaire_id QQ001 --question_id Q00 --session_id  --option_id Q00A1 --format json
echo "Press any key to continue..."
read x
se2226 doanswer --questionnaire_id QQ001 --question_id Q01 --session_id  --option_id Q01A4 --format json
echo "Press any key to continue..."
read x
se2226 doanswer --questionnaire_id QQ001 --question_id Q02 --session_id  --option_id Q02A5 --format json
echo "Press any key to continue..."
read x

echo -e "GETQUESTIONANSWERS TEST \n"
sleep 0.5
se2226 getquestionanswers --questionnaire_id QQ001 --question_id Q02 --format csv
echo "Press any key to continue..."
read x

echo -e "RESETALL TEST \n"
sleep 0.5
se2226 resetall --format csv
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE-UPD TEST \n"
sleep 0.5
se2226 questionnaire-upd --source ../post-files/questionnaire_upd/questionnaire2.json --format json
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE TEST \n"
sleep 0.5
se2226 questionnaire --questionnaire_id QQ002 --format csv
echo "Press any key to continue..."
read x