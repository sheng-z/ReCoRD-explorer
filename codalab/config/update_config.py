import json
import argparse


def main(args):
    with open(args.config) as f:
        config = json.load(f)

    config['submission_tag'] = args.submit_tag
    config['log_worksheet_uuid'] = args.log_worksheet

    config['predict']['mimic'][0]['old'] = args.dev_data
    config['predict']['mimic'][0]['new'] = args.test_data
    config['predict']['tag'] = args.predict_tag

    config['evaluate']['dependencies'][0]['parent_uuid'] = args.eval_script
    config['evaluate']['dependencies'][0]['child_path'] = 'evaluate.py'

    config['evaluate']['dependencies'][1]['parent_uuid'] = args.test_data
    config['evaluate']['dependencies'][1]['child_path'] = 'data.json'

    config['evaluate']['command'] = "python evaluate.py data.json predictions.json"
    config['evaluate']['tag'] = args.eval_tag

    config['score_specs'][0]['key'] = "/stdout:f1"
    config['score_specs'][1]['key'] = "/stdout:exact_match"

    config['metadata']['name'] = 'ReCoRD Competition Leaderboard'

    with open(args.output, 'w') as f:
        json.dump(config, f, indent=2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser('update_config.py')
    parser.add_argument('config', help='Config file.')
    parser.add_argument('output', help='Output config file.')
    parser.add_argument('--log-worksheet')
    parser.add_argument('--dev-data')
    parser.add_argument('--test-data')
    parser.add_argument('--eval-script')
    parser.add_argument('--submit-tag')
    parser.add_argument('--predict-tag')
    parser.add_argument('--eval-tag')

    args = parser.parse_args()
    main(args)