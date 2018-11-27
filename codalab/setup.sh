#!/usr/bin/env bash


eval_worksheet=ReCoRD-Evaluation

data_dir=${HOME}/JHU/Projects/ReCoRD/data

dev_data=${data_dir}/official-record/dev.json
codalab_dev_data=dev-v1.0.json
dev_data_desc="Official ReCoRD 1.0 development set."

evaluation=${data_dir}/evaluate-codalab.py
codalab_evaluation=evaluate-v1.0.py
evaluation_desc="Official ReCoRD 1.0 evaluation script."

human_pred=${data_dir}/baselines/human/dev.json
codalab_human_pred=human-pred.json
human_pred_desc="Human predictions on the dev. set."

macro_name=dev-evaluate-v1.0
macro_in1=dev-evaluate-v1.0-in1
macro_out=dev-evaluate-v1.0-out

test_data_worksheet=ReCoRD-test-data
test_log_worksheet=ReCoRD-test-log
test_data=${data_dir}/official-record/test.json
codalab_test_data=test-v1.0.json

submit_tag='ReCoRD-1.0-test-submit'
predict_tag='recocord-1.0-test-predict'
eval_tag='recocord-1.0-test-eval'

codalab_cli_repo='../codalab-cli'
record_repo='${PWD}'

mode=${1:-"setup"}

test_worksheet=ReCoRD-random-guess
test_model=./test_model
model_name=Random-guess
pred_desc='Random guess (JHU)'


get_run_bundle_ready () {
    state=""
    while true;
    do
        _state="$(cl info $1 -f state)"
        if [[ "${_state}" == "ready" ]]
        then
            printf "${_state}\n"
            break
        elif [[ "${state}" != ${_state} ]]
        then
            printf "${_state}."
        else
            printf "."
        fi
        state=${_state}
    done
}


if [[ "${mode}" == "setup" ]]
then
    printf "=====> (1) Creating the evaluation worksheet...`date`\n"
    # Create the worksheet.
    cl new ${eval_worksheet} || exit
    # Switch to the worksheet.
    cl work ${eval_worksheet} || exit
    # Change the worksheet title.
    cl wedit ${eval_worksheet} -t 'ReCoRD - Evaluation' || exit
    printf "\n\n"

    printf "=====> (2) Upload the development set...`date`\n"
    cl upload ${dev_data} -n ${codalab_dev_data} -d "${dev_data_desc}" || exit
    printf "\n\n"

    printf "=====> (3) Upload the evaluation script...`date`\n"
    cl upload ${evaluation} -n ${codalab_evaluation} -d "${evaluation_desc}" || exit
    printf "\n\n"

    printf "=====> (4) Upload the human prediction on the dev set...`date`\n"
    cl upload ${human_pred} -n ${codalab_human_pred} -d "${human_pred_desc}" || exit
    printf "\n\n"

    printf "=====> (5) Define the dev. set evaluation macro...`date`\n"
    # Define dev. evaluation macro in1.
    cl make ${codalab_human_pred} -n ${macro_in1} || exit
    # Define dev. evaluation macro out.
    cl run :${codalab_evaluation} data.json:${codalab_dev_data} pred.json:${macro_in1} "python ${codalab_evaluation} data.json pred.json" -n ${macro_out} || exit
    printf "\n\n"

    printf "=====> (6) Create a private worksheet for the test set and upload the test set...`date`\n"
    # Create a group for ReCoRD admins.
    cl gnew ReCoRD || exit
    # Create the worksheet.
    cl new ${test_data_worksheet} || exit
    # Switch to the worksheet.
    cl work ${test_data_worksheet} || exit
    # Change the worksheet title.
    cl wedit ${test_data_worksheet} -t 'ReCoRD - test set' || exit
    # Change the permission.
    cl wperm ${test_data_worksheet} public n || exit
    cl wperm ${test_data_worksheet} ReCoRD all || exit
    cl wperm ${eval_worksheet} ReCoRD all || exit
    # Upload the test set.
    cl upload ${test_data} -n ${codalab_test_data} || exit
     # Create the worksheet.
    cl new ${test_log_worksheet} || exit
    # Switch to the worksheet.
    cl work ${test_log_worksheet} || exit
    # Change the worksheet title.
    cl wedit ${test_log_worksheet} -t 'ReCoRD - test prediction log' || exit
    cl wperm ${test_log_worksheet} public n || exit
    cl wperm ${test_log_worksheet} ReCoRD all || exit
    printf "\n\n"

    printf "All done!\t`date`"
    printf "Remember to edit the markdown in the worksheet -- ${eval_worksheet} so it is readable to others.\n"
    printf "Here is a reference markdown: \n"
    printf "https://worksheets.codalab.org/worksheets/0xbe2859a20b9e41d2a2b63ea11bd97740/\n"
elif [[ "${mode}" == "config" ]]
then
    printf "=====> Update the config file...`date`\n"
    _log_worksheet=$(cl work -u ${test_log_worksheet})
    _dev_data=$(cl info ${eval_worksheet}/${codalab_dev_data} -f uuid)
    _eval_script=$(cl info ${eval_worksheet}/${codalab_evaluation} -f uuid)
    # TODO
    _test_data=$(cl info ${test_data_worksheet}/${codalab_test_data} -f uuid)
    python config/update_config.py config/raw.json config/codalab-v1.0.config \
        --log-worksheet ${_log_worksheet} \
        --dev-data ${_dev_data} \
        --test-data ${_test_data} \
        --eval-script ${_eval_script} \
        --submit-tag ${submit_tag} \
        --predict-tag ${predict_tag} \
        --eval-tag ${eval_tag}

elif [[ "${mode}" == "clean" ]]
then
    printf "!! Clean up worksheets.\n"
    cl grm ReCoRD
    cl wrm --force ${eval_worksheet}
    cl wrm --force ${test_data_worksheet}
    cl wrm --force ${test_log_worksheet}
    cl wrm --force ${test_worksheet}
    cl search .mine .floating -u | xargs cl rm -r

elif [[ "${mode}" == "test" ]]
then
    printf "=====> (1) Creating the test worksheet...`date`\n"
    # Create the worksheet.
    cl new ${test_worksheet} || exit
    # Switch to the worksheet.
    cl work ${test_worksheet} || exit
    printf "\n\n"

    printf "=====> (2) Upload the test model...`date`\n"
    cl upload ${test_model} -n src || exit
    printf "\n\n"

    printf "=====> (3) Run the model on the dev. set...`date`\n"
    cl add bundle ${eval_worksheet}//${codalab_dev_data} . || exit
    cl run :${codalab_dev_data} :src "python src/random_guess.py ${codalab_dev_data} predictions.json" -n run-predictions || exit
    get_run_bundle_ready run-predictions
    cl make run-predictions/predictions.json -n predictions-${model_name} -d "${pred_desc}" || exit
    cl macro ${eval_worksheet}/${macro_name} predictions-${model_name} -n ${model_name}-dev || exit
    cl edit predictions-${model_name} --tags ${submit_tag} || exit
    printf "\n\n"

    printf "=====> (4) Please wait util all the asynchronous commands are done, and then run the following commands to automate evaluation on the test set.\n"
    printf "cd ${codalab_cli_repo}\n"
    printf "python ./scripts/competitiond.py -v ${record_repo}/codalab/config/codalab-v1.0.json ${record_repo}/codalab/output/out-v1.0.json\n"

fi
