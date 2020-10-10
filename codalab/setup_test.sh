#!/usr/bin/env bash

test_worksheet=ReCoRD-random-guess
test_model=src
model_name=Random-guess
pred_desc='Random guess (single model) (Test) [created by Sheng Zhang]'


printf "=====> (1) Creating the test worksheet...`date`\n"
# Create the worksheet.
cl new ${test_worksheet} || exit
# Switch to the worksheet.
cl work ${test_worksheet} || exit
printf "\n\n"


printf "=====> (2) Upload the test model...`date`\n"
cl upload ${test_model} || exit
printf "\n\n"


printf "=====> (3) Run the model on the dev. set...`date`\n"
cl add bundle ReCoRD-Evaluation//dev-v1.0.json . || exit
cl run :dev-v1.0.json :src "python src/random_guess.py dev-v1.0.json predictions.json" -n run-predictions || exit
cl make run-predictions/predictions.json -n predictions-${model_name} -d ${pred_desc} || exit
cl macro ReCoRD-Evaluation/dev-evaluate-v1.0 predictions-${model_name}


