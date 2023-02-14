#! /bin/bash

echo -e "HEALTHCHECK TEST \n"
sleep 0.5
se2226 healthcheck --format json
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE TEST \n"
sleep 0.5
se2226 questionnaire --questionnaire_id QQ001 --format json
echo "Press any key to continue..."
read x

echo -e "DOANSWER TEST \n"
sleep 0.5
se2226 doanswer --questionnaire_id QQ001 --question_id  --session_id  --option_id --format json
echo "Press any key to continue..."
read x

echo -e "GETQUESTIONANSWERS TEST \n"
sleep 0.5
se2226 getquestionanswers --questionnaire_id QQ001 --question_id  --format json
echo "Press any key to continue..."
read x

echo -e "RESETALL TEST \n"
sleep 0.5
se2226 resetall --format json
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE-UPD TEST \n"
sleep 0.5
se2226 questionnaire-upd --source exveskoukis.json --format json
echo "Press any key to continue..."
read x

echo -e "QUESTIONNAIRE TEST \n"
sleep 0.5
se2226 questionnaire --questionnaire_id QQ001 --format json
echo "Press any key to continue..."
read x