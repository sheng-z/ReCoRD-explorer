ReCoRD
 ├── version: (string) the version of ReCoRD.
 └── data: (list) ReCoRD examples.
    Each example has the following structure.
     ├── id: (string) the example ID.
     ├── source: (string) the original news source of this example.
     ├── passage: (dict) the passage of this example.
     │   ├── text: (string) the passage text.
     │   └── entities: (list) the named entities in the passage.
     │      Each named entity has the following structure.
     │       ├── start: (int) the start char index of the entity.
     │       └── end: (int) the end char index (inclusive) of the entity.
     └── qas: (list) queries for the corresponding passage
        Each query has the following structure.
         ├── id: (string) the query ID.
         ├── query: (string) the query text (the missing text span is indicated by "@placeholder").
         └── answers: (list) the reference answers.
            Each answer has the following structure.
             ├── start: (int) the start char index of the answer in the passage.
             ├── end: (int) the end char index (inclusive) of the answer in the passage.
             └── text: (string) the answer text
