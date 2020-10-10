# Automated ReCoRD evaluation on Codalab


## Upload ReCoRD evaluation dependencies

Define the following constants which will be used in the setup:
```bash
eval_worksheet=ReCoRD-Evaluation

dev_data=dev.json
codalab_dev_data=dev-v1.0.json
dev_data_desc="Official ReCoRD 1.0 development set."

evaluation=evaluate.py
codalab_evaluation=evaluate-v1.0.py
evaluation_desc="Official ReCoRD 1.0 evaluation script."

human_pred=baselines/human/dev.json
codalab_human_pred=human-pred.json
human_pred_desc="Human predictions on the dev. set."

macro_name=dev-evaluate-v1.0
macro_in1=dev-evaluate-v1.0-in1
macro_out=dev-evaluate-v1.0-out

test_data_worksheet=ReCoRD-test-data
test_data=test.json
codalab_test_data=test-v1.0.json

submit_tag='ReCoRD-test-submit'
codalab_cli_repo='../codalab-cli'
record_repo='${PWD}'
```

(1) Create a worksheet named `${eval_worksheet}` where you need to upload bundles for the evaluation data and script.

```bash
# Create the worksheet.
cl new ${eval_worksheet}
# Switch to the worksheet.
cl work ${eval_worksheet}
# Change the worksheet title.
cl wedit ${eval_worksheet} -t 'ReCoRD - Evaluation'
```

(2) Upload the develepment set.

```bash
cl upload ${dev_data} -n ${codalab_dev_data} -d ${dev_data_desc}
```

(3) Upload the evaluation script.

```bash
cl upload ${evaluation} -n ${codalab_evaluation} -d ${evaluation_desc}
```

(4) Upload the human prediction on the dev set.

```bash
cl upload ${human_pred} -n ${codalab_human_pred} -d ${human_pred_desc}
```

(5) Define the dev. set evaluation macro.

```bash
# Define dev. evaluation macro out.
cl run :${codalab_evaluation} data.json:${codalab_dev_data} pred.json:${codalab_human_pred} "python ${codalab_evaluation} data.json pred.json" -n ${macro_out}
# Define dev. evaluation macro in1.
cl make ${codalab_human_pred} -n ${macro_in1}
```

(6) Create a **private** worksheet for the test set and upload the test set.

```bash
# Create a group for ReCoRD admins.
cl gnew ReCoRD
# Create the worksheet.
cl new ${test_data_worksheet}
# Switch to the worksheet.
cl work ${test_data_worksheet}
# Change the worksheet title.
cl wedit ${test_data_worksheet} -t 'ReCoRD - test set'
# Change the permission.
cl wperm ${test_data_worksheet} public n
cl wperm ${test_data_worksheet} ReCoRD all
cl wperm ${eval_worksheet} ReCoRD all
# Upload the test set.
cl upload ${test_data}
```

## Test the automated evaluation

Define the following constants which will be used in the setup:
```bash
test_worksheet=ReCoRD-random-guess
test_model=src
model_name=Random-guess
pred_desc='Random guess (single model) (Test) [created by Sheng Zhang]'
```

(1) Create a test worksheet.

```bash
# Create the worksheet.
cl new ${test_worksheet}
# Switch to the worksheet.
cl work ${test_worksheet}
```

(2) Upload the test model.

```bash
cl upload ${test_model}
```

The model should be runnable with the following arguments:
```bash
python src/<path-to-prediction-program> <input-data-json-file> <output-prediction-json-path>
```

(3) Run the model the on dev. set.

Let's now test to make sure the source code generates predictions on the dev set. First, copy the dev data to your worksheet by typing the following command into the `web interface terminal`.

**Important: please do not upload the dev data yourself!**

```bash
cl add bundle ${eval_worksheet}//${codalab_dev_data} .
```

Then wrap the following CodaLab command around the command for your program that generates the predictions. Be sure to replace <path-to-prediction-program> with your actual program path.

```bash
cl run :${codalab_dev_data} :src "python src/<path-to-prediction-program> ${codalab_dev_data} predictions.json" -n run-predictions
```

You should see a run-bundle like the following appended to the contents of your worksheet. If the bundle fails, then contact us and we can help you out.

...

Now we are going to extract out the predictions file into a bundle of its own. Let's do this as follows:

```bash
cl make run-predictions/predictions.json -n predictions-${model_name} -d ${pred_desc}
```

Your `${model_name}` should not contain spaces (avoid using special characters too). You should see a bundle like the following appended to the contents of your worksheet.

...

Now, let's verify that we can evaluate the predictions on the development set.

```bash
cl macro ${eval_worksheet}/${macro_name} predictions-${model_name}
```

Once this succeeds, you should see the scores for your model appended to the worksheet.


(4) Automated evaluation on the hidden test set.

We're now finally going to add the `${submit_tag}` flag to mark the bundle as ready for submission. Let's run the following command:

```bash
cl edit predictions-${model_name} --tags ${submit_tag}
```

Run the following command to start the evaluation.

```bash
# If the command doesn't work, pull the latest codalab-cli, check out the latest tag,
# and install the latest version via `pip install -e .`. 
# The latest codalab-cli: https://github.com/codalab/codalab-worksheets/tree/master
cd ${codalab_cli_repo}  # codalab_cli_repo=codalab-cli
python ./scripts/competitiond.py -v ../config/codalab-v1.0.json out-v1.0.json
```

Check the codalab worksheet. Once the evaluation is done, run the above command again and copy the output file:

```bash
cd ${codalab_cli_repo}  # codalab_cli_repo=codalab-cli
python ./scripts/competitiond.py -v ../config/codalab-v1.0.json out-v1.0.json
cp out-v1.0.json ../output/ 
```

Assuming `gulp` is installed, go back to the root (i.e. the explorer dir) and update the leaderboard.
```bash
cd ..
gulp
gulp connect    # Compare the new leaderboard to the existing one.
```