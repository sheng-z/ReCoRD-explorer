import json
from collections import namedtuple


QA = namedtuple('QA', [
    'passage_id',
    'data_source',
    'passage_text',
    'entities',
    'query_id',
    'query_text',
    'answers'
])


def load(data_file):
    with open(data_file) as f:
        dataset = json.load(f)['data']
    for passage in dataset:
        for query in passage['qas']:
            qa = QA(
                passage_id=passage['id'],
                data_source=passage['source'],
                passage_text=passage['passage']['text'],
                entities=passage['entities'],
                query_id=query['id'],
                query_text=query['query'],
                answers=query['answers']
            )
        yield qa


def convert_to_squad_format(data_file, output=None):
    paragraph_id, paragraph = None, None
    articles = []
    for qa in load(data_file):
        if qa.passage_id != paragraph_id:
            if paragraph_id is not None:
                articles.append(dict(
                    title=paragraph['id'],
                    paragraphs=[paragraph]
                ))
            paragraph = dict(
                id=qa.passage_id,
                context=qa.passage_text,
                entities=qa.entities,
                qas=[]
            )
            paragraph_id = qa.passage_id
        paragraph['qas'].append(dict(
            id=qa.query_id,
            question=qa.query_text,
            answers=[dict(
                answer_start=a['start'],
                text=a['text']
            ) for a in qa.answers]
        ))

    articles.append(dict(
        title=paragraph['id'],
        paragraphs=[paragraph]
    ))

    dataset = dict(
        data=articles,
        version='1.0'
    )
    if output is not None:
        with open(output, 'w') as f:
            json.dump(dataset, f)

    return  dataset
