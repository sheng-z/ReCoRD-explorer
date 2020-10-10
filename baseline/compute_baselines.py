import json

baselines = [
    dict(
        name="DocumentQA w/ ELMo (single model) (JHU [modification of the AllenNLP implementation]) https://arxiv.org/pdf/1710.10723.pdf",
        em=45.44,
        f1=46.65,
        created=1540512305
    ),
    dict(
        name="SAN (single model) (Microsoft Business Applications Research Group) https://arxiv.org/pdf/1712.03556.pdf",
        em=39.77,
        f1=40.72,
        created=1540512305
    ),
    dict(
        name="DocumentQA (single model) (JHU [modification of the AllenNLP implementation]) https://arxiv.org/pdf/1710.10723.pdf",
        em=38.52,
        f1=39.76,
        created=1540512305
    ),
    dict(
        name="ASReader (single model) (JHU [modification of the IBM Waston implementation]) https://arxiv.org/pdf/1603.01547.pdf",
        em=29.80,
        f1=30.35,
        created=1540512305
    ),
    dict(
        name="Random Guess (JHU)",
        em=18.55,
        f1=19.12,
        created=1540512305
    ),
    dict(
        name="Language Models (single model) (JHU [modification of the Google Brain implementation]) https://arxiv.org/pdf/1806.02847.pdf",
        em=17.57,
        f1=18.15,
        created=1540512305
    ),
]


def main():
    output = {}
    leaderboard = []
    for baseline in baselines:
        leaderboard.append(dict(
            scores=dict(
                exact_match=baseline['em'],
                f1=baseline['f1']
            ),
            submission=dict(
                created=baseline['created'],
                description=baseline['name'],
            )
        ))
    output['leaderboard'] = leaderboard
    with open('./baseline/results.json', 'w') as f:
        json.dump(output, f, indent=2)

if __name__ == '__main__':
    main()