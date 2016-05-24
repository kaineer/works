var Tasks = require("./lib/tasks");
var Task = require("./lib/task");
var checks = require("./lib/checks");
var createTemplate = require("./lib/create_template");
var guard = require("./lib/guard");
var sandboxEval = require("./lib/sandbox");

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');

var buildTasks = function() {
  var tasks = new Tasks();

  tasks.addTask(checks.infiniteForLoop,
    "Объявите пустой цикл for (с обязательным блочным телом цикла)");
  tasks.addTask(checks.infiniteForWithInit,
    "Задайте исходную переменную-счётчик i со значением 1");
  tasks.addTask(checks.infiniteForWithInitAndTest,
    "Задайте условие выхода из цикла i < 10");
  tasks.addTask(checks.normalForEmptyBody,
    "Задайте операцию обновления состояния, в которой i будет увеличиваться на 2 в каждой итерации");
  tasks.addTask(checks.normalForWithConsole,
    "Выведите внутри цикла переменную i в консоль: console.log(i);");

  return tasks;
};

var tasks = buildTasks();

var taskTemplate = createTemplate(function(e, ref) {
  return e("div", {class: "task task_state_" + ref("state")}, ref("name"));
});

var completedTemplate = createTemplate(function(e, ref) {
  return e("div", {class: "tasks tasks_completed"}, "Задание выполнено");
});

var initAce = function() {
  var editor = ace.edit("editor");
  var session = editor.getSession();

  var guardDiv = document.querySelector(".js--guard");

  editor.setTheme("ace/theme/monokai");
  session.setMode("ace/mode/javascript");
  session.on("change", function(e) {
    var code = session.getValue();
    var guardMessage = guard.checkCode(code);
    var checkResult;

    if(guardMessage) {
      guardDiv.innerHTML = guardMessage.message;
    } else {
      runCode(code);
    }

    checkResult = tasks.check(code);

    if(checkResult) {
      guardDiv.innerHTML = "";
      renderTasks();
    }
  });
};

var renderTasks = function() {
  var tasksDiv = document.querySelector(".js--tasks");

  tasksDiv.innerHTML = "";

  tasks.toJSON().tasks.forEach(function(task) {
    tasksDiv.appendChild(taskTemplate(task))
  });

  if(tasks.isCompleted()) {
    tasksDiv.appendChild(completedTemplate());
  }
};

function limitEval(code, opt_timeoutInMS, fnOnStop) {
  var id = Math.random() + 1,
    blob = new Blob(
      ['onmessage=function(a){a=a.data;postMessage({i:a.i+1});postMessage({r:eval.call(this,a.c),i:a.i})};'],
      { type:'text/javascript' }
    ),
    myWorker = new Worker(URL.createObjectURL(blob));

  function onDone() {
    URL.revokeObjectURL(blob);
    fnOnStop.apply(this, arguments);
  }

  myWorker.onmessage = function (data) {
    data = data.data;
    if (data) {
      if (data.i === id) {
        id = 0;
        onDone(true, data.r);
      }
      else if (data.i === id + 1) {
        setTimeout(function() {
          if (id) {
            myWorker.terminate();
            onDone(false);
          }
        }, opt_timeoutInMS || 1000);
      }
    }
  };

  myWorker.postMessage({ c: code, i: id });
}

var runCode = function(code) {
  (function() {
    try {
      sandboxEval(code, {
        timeout: 500,
        loopTimes: 50
      });
    } catch(err) {
      console.log(err);
    }
  })();
};

window.onload = function() {
  initAce();
  renderTasks();
};
