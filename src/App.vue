<template>
  <div id="app">
    <TlHeader :tabs="tabs" :currentTab.sync="currentTab"/>
    <div class="main">
      <ul class="list">
        <TlTask
          v-if="currentTab === 'My Tasks'"
          :isAddMode="true"
          :id="newTask.id"
          :title.sync="newTask.title"
          :description.sync="newTask.description"
          :isFinished.sync="newTask.isFinished"
          :isFavorite.sync="newTask.isFavorite"
          @reset:task="newTask = { ...emptyTask }"
          @add:task="addTask"
        />
        <TlTask
          v-for="task in showTasks"
          :key="`main${_uid}_${task.id}`"
          :id="task.id"
          :title.sync="task.title"
          :description.sync="task.description"
          :isFinished.sync="task.isFinished"
          :isFavorite.sync="task.isFavorite"
          @delete:task="deleteTask"
        />
      </ul>
      <div v-if="!isLoading" class="task_counter">{{ taskCount }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Component, Vue } from 'vue-property-decorator';
import TlHeader from './components/Header.vue';
import TlTask from './components/Task.vue';

interface Task {
  id: string;
  title: string;
  description: string;
  isFinished: boolean;
  isFavorite: boolean;
  isRemoved: boolean;
  updateTime: string;
}

interface IndexedDBTask extends DBSchema {
  tasks: {
    value: {
      id: string;
      title: string;
      description: string;
      isFinished: boolean;
      isFavorite: boolean;
      updateTime: string;
      isRemoved: boolean;
    };
    key: string;
    indexes: { 'by-id': string };
  };
}

@Component({
  components: {
    TlHeader,
    TlTask,
  },
})
export default class App extends Vue {
  private tabs: Array<string> = ['My Tasks', 'In Progress', 'Completed']

  private currentTab = ''

  private tasks: Array<Task> = []

  private isLoading = true

  private emptyTask: Task = {
    id: '',
    title: '',
    description: '',
    isFinished: false,
    isFavorite: false,
    isRemoved: false,
    updateTime: '',
  };

  private newTask: Task = {
    id: '',
    title: '',
    description: '',
    isFinished: false,
    isFavorite: false,
    isRemoved: false,
    updateTime: '',
  };

  private db!: IDBPDatabase<IndexedDBTask>;

  get taskCount(): string {
    if (this.currentTab === 'Completed') {
      return `${this.showTasks.length} task completed`;
    }

    return `${this.showTasks.length} tasks left`;
  }

  get showTasks(): Array<Task> {
    if (this.currentTab === 'My Tasks') {
      return this.tasks.filter((task) => !task.isRemoved).sort(this.sortById);
    }

    if (this.currentTab === 'In Progress') {
      return this.tasks.filter((task) => !task.isFinished && !task.isRemoved).sort(this.sortById);
    }

    if (this.currentTab === 'Completed') {
      return this.tasks.filter((task) => task.isFinished && !task.isRemoved).sort(this.sortById);
    }

    return this.tasks.filter((task) => !task.isRemoved).sort(this.sortById);
  }

  async created() {
    [this.currentTab] = this.tabs;
    this.db = await this.initIndexedDB();
    const indexDBTasks = await this.db.getAll('tasks');
    axios.get('/api/tasks')
      .then(async (response) => {
        this.tasks = await this.syncIndexDBAndServerDB(response.data, indexDBTasks);
        this.tasks.forEach((task) => {
          this.$watch(() => task, this.syncTaskToDatabase, { deep: true });
        });
      })
      .catch(() => {
        this.tasks = indexDBTasks;
        this.tasks.forEach((task) => {
          this.$watch(() => task, this.syncTaskToDatabase, { deep: true });
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private sortById(a: Task, b: Task) {
    return parseInt(a.id, 10) - parseInt(b.id, 10);
  }

  private async syncTaskToDatabase(newVal: Task) {
    const updateTask = { ...newVal };
    updateTask.updateTime = new Date().getTime().toString();
    await axios.put(`/api/tasks/${newVal.id}`, updateTask)
      .catch(() => console.error('no network!'))
      .finally(async () => {
        await this.db.put('tasks', updateTask);
      });
  }

  private deleteTask(id: string) {
    const currentTask = this.tasks.find((task) => task.id === id);
    if (currentTask !== undefined) {
      currentTask.isRemoved = true;
    }
  }

  private async addTask() {
    const currentTimestamp = new Date().getTime().toString();
    this.newTask.id = currentTimestamp;
    this.newTask.updateTime = currentTimestamp;
    this.tasks = [...this.tasks, this.newTask];
    await axios.post('/api/tasks', this.newTask).catch(() => console.error('no network!')).finally(async () => {
      await this.db.put('tasks', this.newTask);
      this.newTask = { ...this.emptyTask };
      this.$watch(() => this.tasks[this.tasks.length - 1], this.syncTaskToDatabase, { deep: true });
    });
  }

  private initIndexedDB() {
    return openDB<IndexedDBTask>('todolist', 1, {
      upgrade(db) {
        const taskStore = db.createObjectStore('tasks', {
          keyPath: 'id',
        });

        taskStore.createIndex('by-id', 'id');
      },
    });
  }

  private async syncIndexDBAndServerDB(serverData: Array<Task>, indexDBData: Array<Task>) {
    const tasks = [...serverData];
    indexDBData.forEach(async (indexDBtask, index) => {
      const serverTask = tasks.find((data) => data.id === indexDBtask.id);
      if (serverTask !== undefined) {
        if (serverTask.updateTime > indexDBtask.updateTime) {
          await this.db.put('tasks', serverTask);
        } else if (serverTask.updateTime < indexDBtask.updateTime) {
          tasks[index] = indexDBtask;
          await axios.put(`/api/tasks/${indexDBtask.id}`, indexDBtask).catch(() => console.error('no network!'));
        }
      } else {
        tasks.push(indexDBtask);
        await axios.post('/api/tasks', indexDBtask).catch(() => console.error('no network!'));
      }
    });

    tasks.forEach(async (task) => {
      const indexDBtask = indexDBData.find((data) => data.id === task.id);
      if (indexDBtask === undefined) {
        this.db.put('tasks', task);
      }
    });

    return tasks;
  }
}
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #E1E1E1;
}

.main {
  padding: 22px 0 27px;
}

.list {
  list-style-type: none;
  margin: 0;
  padding: 0 40px;
  & > .tl-task + .tl-task {
    margin-top: 24px;
  }
}

.task_counter {
  font-style: italic;
  font-size: 24px;
  color: #C8C8C8;
  max-width: 620px;
  margin: 0 auto;
  padding-left: 33px;
  margin-top: 8px;
}
</style>
