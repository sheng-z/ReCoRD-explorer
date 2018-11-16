import sys
import json
import random


def main(input, output):
    random.seed(1)

    with open(input) as f:
        predictions = {}
        examples = json.load(f)['data']

        for example in examples:
            passage_text = example['passage']['text']
            entities = example['passage']['entities']
            candidates = [passage_text[e['start']:e['end']+1] for e in entities]
            for qas in example['qas']:
                predictions[qas['id']] = random.choice(candidates)

    with open(output, 'w') as f:
        json.dump(predictions, f)

if __name__ == '__main__':
    main(*sys.argv[1:])
