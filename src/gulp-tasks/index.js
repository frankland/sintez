import sintez from '../index';

import Build from './src/build';
import Server from './src/server';
import Clear from './src/clear';


import HtmlWatch from './src/html/watch';
import HtmlCompile from './src/html/compile';

import LessWatch from './src/less/watch';
import LessCompile from './src/less/compile';

import StaticWatch from './src/static/watch';
import StaticCopy from './src/static/copy';

import BuilderInfo from './src/info/builder';
import ResourcesInfo from './src/info/resources';
import ServerInfo from './src/info/server';
import SintezInfo from './src/info/sintez';

import Dev from './src/dev';
import All from './src/all';



import TaskManager from './gulp-task-manager';


export default (gulp) => {
  var taskManager = new TaskManager(gulp);

  taskManager.add(new Build(gulp, sintez));
  taskManager.add(new Server(gulp, sintez));
  taskManager.add(new Clear(gulp, sintez));

  taskManager.add(new HtmlWatch(gulp, sintez));
  taskManager.add(new HtmlCompile(gulp, sintez));

  taskManager.add(new LessWatch(gulp, sintez));
  taskManager.add(new LessCompile(gulp, sintez));

  taskManager.add(new StaticWatch(gulp, sintez));
  taskManager.add(new StaticCopy(gulp, sintez));

  taskManager.add(new BuilderInfo(gulp, sintez));
  taskManager.add(new ResourcesInfo(gulp, sintez));
  taskManager.add(new ServerInfo(gulp, sintez));
  taskManager.add(new SintezInfo(gulp, sintez));

  taskManager.add(new Dev(gulp, sintez));
  taskManager.add(new All(gulp, sintez));
};
