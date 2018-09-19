var pug = require('gulp-pug')
var gulp = require('gulp')
var rename = require('gulp-rename')
var data = require('gulp-data')
var connect = require('gulp-connect')
var replace = require('gulp-replace')
var ghPages = require('gulp-gh-pages')
var bower = require('gulp-bower')
var image = require('gulp-image')
var stylus = require('gulp-stylus')
var minify = require('gulp-minify')
var path = require('path')
var fs = require('fs')
var cheerio = require('cheerio')

var build_dir = 'my-explorer/' // good to have this be the same as the repo name for gh-pages purposes

var exp = "<fieldset><legend id='context-title'>PASSAGE</legend> <div class='noselect' id='context' data-toggle='buttons'> <p><a class='btn entity correct-answer' onclick=enable_submit('Brendan&nbsp;Rodgers')><input id='answer' name='answer' value='0-0-15-Brendan Rodgers' type='radio' required=''/>Brendan Rodgers</a> believes <a class='btn entity' onclick=enable_submit('Thibaut&nbsp;Courtois')><input id='answer' name='answer' value='1-25-41-Thibaut Courtois' type='radio' required=''/>Thibaut Courtois</a> was the main reason <a class='btn entity' onclick=enable_submit('Chelsea')><input id='answer' name='answer' value='3-62-69-Chelsea' type='radio' required=''/>Chelsea</a> reached the <a class='btn entity' onclick=enable_submit('Capital&nbsp;One&nbsp;Cup')><input id='answer' name='answer' value='5-82-97-Capital One Cup' type='radio' required=''/>Capital One Cup</a> final after his <a class='btn entity correct-answer' onclick=enable_submit('Liverpool')><input id='answer' name='answer' value='7-114-123-Liverpool' type='radio' required=''/>Liverpool</a> side were dumped out after extra-time at <a class='btn entity' onclick=enable_submit('Stamford&nbsp;Bridge')><input id='answer' name='answer' value='9-165-180-Stamford Bridge' type='radio' required=''/>Stamford Bridge</a>. After a brilliant performance in the first leg at <a class='btn entity' onclick=enable_submit('Anfield')><input id='answer' name='answer' value='12-232-239-Anfield' type='radio' required=''/>Anfield</a>, <a class='btn entity' onclick=enable_submit('Courtois')><input id='answer' name='answer' value='1-241-249-Courtois' type='radio' required=''/>Courtois</a> kept a clean sheet as <a class='btn entity' onclick=enable_submit('Jose&nbsp;Mourinho')><input id='answer' name='answer' value='15-272-285-Jose Mourinho' type='radio' required=''/>Jose Mourinho</a>&#x27;s men advanced with a 1-0 victory (2-1 on aggregate) courtesy of <a class='btn entity' onclick=enable_submit('Branislav&nbsp;Ivanovic')><input id='answer' name='answer' value='20-351-369-Branislav Ivanovic' type='radio' required=''/>Branislav Ivanovic</a>&#x27;s header. <a class='btn entity' onclick=enable_submit('Rodgers')><input id='answer' name='answer' value='0-380-387-Rodgers' type='radio' required=''/>Rodgers</a> claimed his side were the better team over the two legs, despite failing to make it to <a class='btn entity' onclick=enable_submit('Wembley')><input id='answer' name='answer' value='25-475-482-Wembley' type='radio' required=''/>Wembley</a>. <a class='btn entity' onclick=enable_submit('Thibaut&nbsp;Courtois')><input id='answer' name='answer' value='1-484-500-Thibaut Courtois' type='radio' required=''/>Thibaut Courtois</a> (left) keeps the score level at 0-0 with a fine save from <a class='btn entity' onclick=enable_submit('Liverpool')><input id='answer' name='answer' value='7-559-568-Liverpool' type='radio' required=''/>Liverpool</a>&#x27;s <a class='btn entity' onclick=enable_submit('Alberto&nbsp;Moreno')><input id='answer' name='answer' value='27-571-585-Alberto Moreno' type='radio' required=''/>Alberto Moreno</a> <a class='btn entity' onclick=enable_submit('Brendan&nbsp;Rodgers')><input id='answer' name='answer' value='0-586-601-Brendan Rodgers' type='radio' required=''/>Brendan Rodgers</a> insists his side were the better team despite being knocked out by <a class='btn entity' onclick=enable_submit('Chelsea')><input id='answer' name='answer' value='3-669-676-Chelsea' type='radio' required=''/>Chelsea</a> over two legs </p> <ul class='highlights'> <li> <a class='btn entity' onclick=enable_submit('Chelsea')><input id='answer' name='answer' value='3-702-709-Chelsea' type='radio' required=''/>Chelsea</a> beat <a class='btn entity' onclick=enable_submit('Liverpool')><input id='answer' name='answer' value='7-715-724-Liverpool' type='radio' required=''/>Liverpool</a> 1-0 after extra-time (2-1 on aggregate) </li> <li> <a class='btn entity' onclick=enable_submit('Brendan&nbsp;Rodgers')><input id='answer' name='answer' value='0-776-791-Brendan Rodgers' type='radio' required=''/>Brendan Rodgers</a> heaped praise on <a class='btn entity' onclick=enable_submit('Chelsea')><input id='answer' name='answer' value='3-809-816-Chelsea' type='radio' required=''/>Chelsea</a> goalkeeper <a class='btn entity' onclick=enable_submit('Thibaut&nbsp;Courtois')><input id='answer' name='answer' value='1-828-844-Thibaut Courtois' type='radio' required=''/>Thibaut Courtois</a> </li> <li> The <a class='btn entity' onclick=enable_submit('Liverpool')><input id='answer' name='answer' value='7-860-869-Liverpool' type='radio' required=''/>Liverpool</a> boss believes his side were the better team over two legs </li> <li> <a class='btn entity' onclick=enable_submit('Rodgers')><input id='answer' name='answer' value='0-939-946-Rodgers' type='radio' required=''/>Rodgers</a> was unhappy with <a class='btn entity' onclick=enable_submit('Diego&nbsp;Costa')><input id='answer' name='answer' value='56-964-975-Diego Costa' type='radio' required=''/>Diego Costa</a>&#x27;s behaviour at <a class='btn entity' onclick=enable_submit('Stamford&nbsp;Bridge')><input id='answer' name='answer' value='9-991-1006-Stamford Bridge' type='radio' required=''/>Stamford Bridge</a></li> </ul> </div> </fieldset><br><br> <fieldset> <legend id='query-title'>QUERY </legend> <div class='noselect' id='query'>At <span class='placeholder-init' id='placeholder'>@placeholder</span> and here tonight he&#x27;s made very, very important saves and that&#x27;s won them the game. </div> </fieldset><br> <div id='hint'><span id='tips'>(Click to show the answers)<span></div><br><br> <div id='next-example'><a href='/' class='button'>Go to the next example &rarr;</a></div>"


var rankEntries = function (entries) {
  entries.sort(function (a, b) {
    var f1Diff = Math.sign(b.f1 - a.f1)
    var emDiff = Math.sign(b.em - a.em)
    return f1Diff + emDiff
  })

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i]
    if (i === 0) {
      entry.rank = 1
    } else {
      var prevEntry = entries[i - 1]
      var rank = prevEntry.rank
      if (entry.em < prevEntry.em && entry.f1 < prevEntry.f1) rank++
      entry.rank = rank
    }
  }
  return entries
}

function assert (condition, message) {
  if (!condition) {
    throw message || 'Assertion failed'
  }
}

var parseCompEntries = function (comp_file) {
  var leaderboard = require(comp_file).leaderboard
  var entries = []

  for (var i = 0; i < leaderboard.length; i++) {
    try {
      var o_entry = leaderboard[i]
      var entry = {}
      entry.user = o_entry.submission.user_name
      var description = o_entry.submission.description.trim()
      entry.model_name = description.substr(0, description.lastIndexOf('(')).trim()
      var firstPart = description.substr(description.lastIndexOf('(') + 1)
      entry.institution = firstPart.substr(0, firstPart.lastIndexOf(')'))
      if (description.lastIndexOf('http') !== -1) {
        entry.link = description.substr(description.lastIndexOf('http')).trim()
      }
      entry.date = o_entry.submission.created
      entry.em = parseFloat(o_entry.scores.exact_match)
      entry.f1 = parseFloat(o_entry.scores.f1)
      if (!(entry.em >= 0)) throw 'Score invalid'
      // if (entry.em < 50) throw 'Score too low'
      if (entry.model_name === '') {
        entry.model_name = 'Unnamed submission by ' + entry.user
      }
      // if (entry.em > 50 && entry.f1 > 60) {
      entries.push(entry)
    } catch (err) {
      console.error(err)
      console.error(entry)
    }
  }
  entries = rankEntries(entries)
  return entries
}

var parseEntries = function (htmlStr) {
  var $ = cheerio.load(htmlStr)
  var parent = $('h1#leaderboard').closest('.ws-item').next()
  var entries = []
  $(parent).find('tbody > tr').each(function () {
    var entry = {}
    var cells = $(this).find('td')
    entry.description = cells.eq(1).text().trim()
    entry.model_name = entry.description.substr(0, entry.description.lastIndexOf('(')).trim()
    var firstPart = entry.description.substr(entry.description.lastIndexOf('(') + 1)
    entry.institution = firstPart.substr(0, firstPart.lastIndexOf(')'))
    var httpPos = entry.description.lastIndexOf('http')
    if (httpPos !== -1) {
      entry.link = entry.description.substr(entry.description.lastIndexOf('http')).trim()
    }
    delete entry.description
    entry.f1 = parseFloat(cells.eq(4).text())
    entry.em = parseFloat(cells.eq(3).text())
    entry.date = cells.eq(2).text().trim()
    entries.push(entry)
  })
  entries = rankEntries(entries)
  return entries
}

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./' + build_dir + 'bower_components/'))
})

gulp.task('image', function () {
  return gulp.src('./views/images/*')
    .pipe(image())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('js', function () {
  return gulp.src('./views/js/*')
    .pipe(minify())
    .pipe(gulp.dest('./' + build_dir + 'javascripts/'))
})

gulp.task('copy_dataset', function () {
  gulp
    .src('dataset/*')
    .pipe(gulp.dest('./' + build_dir + 'dataset/'))
})

gulp.task('scrape_website', function (cb) {
  var Nightmare = require('nightmare')
  var fs = require('fs')
  var parse
  var nightmare = new Nightmare({
    switches: {
      'ignore-certificate-errors': true
    }
  })
  nightmare.goto('https://worksheets.codalab.org/worksheets/0x62eefc3e64e04430a1a24785a9293fff/')
  .wait(2000)
  .evaluate(function () {
    return document.body.innerHTML
  })
  .end()
  .then(function (result) {
    var jsonfile = require('jsonfile')
    var after = parseEntries(result)
    jsonfile.writeFile('./test.json', after, cb)
  })
})

gulp.task('copy_models', function () {
  gulp
    .src('models/*')
    .pipe(gulp.dest('./' + build_dir + 'models/'))
})

gulp.task('connect', function () {
  connect.server({
    root: '.'
  })
})

var dataset_folder = './dataset/'
var filepaths = [
  dataset_folder + 'dev-v1.1.json'
  // dataset_folder + 'train-v1.1.json',
  // dataset_folder + 'dev-v1.0.json',
  // dataset_folder + 'train-v1.0.json'
]

var exploration_tasks = []

filepaths.forEach(function (filename) {
  var article_generations = []
  var build_prefix = 'explore/'

  var json_file = require(filename)
  var version = json_file.version
  var split = path.basename(filename, '.json').split('-')[0]
  var json_data = json_file.data
  var version_and_split = version + '/' + split

  json_data.forEach(function (article) {
    var name = version_and_split + '/' + article['title']
    gulp.task(name, function () {
      return gulp.src('views/article.pug')
        .pipe(data(function () {
          return article
        }))
        .pipe(pug())
        .pipe(rename(name + '.html'))
        .pipe(gulp.dest('./' + build_dir + build_prefix))
    })
    article_generations.push(name)
    exploration_tasks.push(name)
  })

  // models
  var models_folder = './models/'
  var models = fs.readdirSync(models_folder).map(
    function (a) { return a.slice(0, -5) })

  var list_task_name = version_and_split + '/' + 'index'
  exploration_tasks.push(list_task_name)
  gulp.task(list_task_name, function () {
    return gulp.src('views/explore.pug')
      .pipe(data(function () {
        return {
          'articles': article_generations,
          'prefix': build_prefix,
          'version': version,
          'split': split,
          'models': models
        }
      }))
      .pipe(pug())
      .pipe(rename(list_task_name + '.html'))
      .pipe(gulp.dest('./' + build_dir + build_prefix))
  })
})

var example_tasks = []
var example_file = './examples.json'
var json_examples = require(example_file)
json_examples.forEach(function (example) {
    var example_id = example['id']
    var name = 'example-' + example['idx']
    gulp.task(name, function () {
        return gulp.src('views/example.pug')
            .pipe(data(function () {
                return {
                    'example_id': example_id,
                    'example_html': example['html']
                }
            }))
            .pipe(pug())
            .pipe(rename(example['idx'] + '.html'))
            .pipe(gulp.dest('./' + build_dir + 'examples/'))

    })
    example_tasks.push(name)
})

gulp.task('test_example', function () {
  return gulp.src('views/example.pug')  
      .pipe(data(function () {
         return {
           'example_id': 'TEST EXAMPLE',
           'example_html': exp  
         } 
      }))
      .pipe(pug())
      .pipe(rename('test_example.html'))
      .pipe(gulp.dest('./' + build_dir + 'examples/'))
})

gulp.task('process_comp_output', function (cb) {
  var jsonfile = require('jsonfile')
  var entries1 = parseCompEntries('./baseline/results.json')
  jsonfile.writeFile('./baseline.json', entries1, cb)
})

gulp.task('generate_index', ['process_comp_output'], function () {
  var test = require('./baseline.json')
  var moment = require('moment')
  return gulp.src('views/index.pug')
      .pipe(data(function () {
        return { 'baselines': test,
          'moment': moment}
      }))
    .pipe(pug())
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('correct_link_paths', ['generate'], function () {
  return gulp.src('./' + build_dir + '**/*.html')
    .pipe(replace(/([^-](?:href|src)=[\'\"]\/)([^\'\"]*)([\'\"])/g, '$1' + build_dir + '$2$3'))
    .pipe(gulp.dest('./' + build_dir))
})

gulp.task('css', function () {
  return gulp.src('./views/styles/*.styl')
    .pipe(stylus())
    .pipe(replace(/(bower_components)/g, build_dir + '$1'))
    .pipe(gulp.dest('./' + build_dir + 'stylesheets'))
})

gulp.task('deploy', function () {
  return gulp.src('./' + build_dir + '**/*')
    .pipe(ghPages())
})

gulp.task('generate_exploration', exploration_tasks)
gulp.task('generate_examples_1', example_tasks)
gulp.task('generate', ['bower', 'generate_examples_1', 'generate_index', 'process_comp_output'])
// gulp.task('generate', ['bower', 'generate_index', 'process_comp_output'])
gulp.task('default', ['generate', 'correct_link_paths', 'image', 'js', 'css', 'copy_dataset', 'copy_models'])
