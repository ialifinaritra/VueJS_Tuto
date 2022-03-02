<template>
  <el-container class="mainContainer">

    <el-aside width="200px">
      <TheMenu />
    </el-aside>

    <el-container>
      
      <el-header height="60px">
        <TheTopTask  ref="TheTopTask" @newTask="addTask($event)"/>
      </el-header>

      <el-main>

        
        <router-view> </router-view>

        <TaskList 
          :tasks="tasks" 
          :areTasksLoading="areTasksLoading"
          v-on=" {
            restart: sendRestartTask,
            delete: deleteTask,
          }"
        />
      </el-main>

    </el-container>

  </el-container>
</template>

<script>
  import TheMenu from './components/TheMenu.vue'
  import TheTopTask from './components/TheTopTask.vue'
  import TaskList from './components/TaskList.vue'
  import * as TaskService from './services/TaskService.js'

  export default {
    components: {
      TheMenu,
      TheTopTask,
      TaskList
    },
    data() {
      return {
        tasks: [],
        areTasksLoading: true
      }
    },
    watch: {
      tasks: {
        // Mise à jour de toutes les tachees en API dès que tasks change
        deep: true,
        async handler (newVal, oldVal){
          if (newVal !== null && oldVal !== null){
            try {
              await TaskService.updateAll(this.tasks)
            } catch (e){
              console.error(e)
              this.$notify({
                title: 'Mode hors-ligne',
                message : `Synchronistion des taches impossible`,
                type: 'error',
                offset: 50,
                duration:3000
              })
            }
          }
        }
      }

    },

    async created (){
      try {
        this.tasks = await TaskService.getAll()
      } catch (e) {
        console.error(e)
        this.tasks = []
        this.$notify({
          title : "Mode hors-ligne",
          message: `Récupération des taches impossible`,
          type: 'error',
          offset: 50,
          duration: 3000
        })
      }
      this.areTasksLoading = false
    },

    methods: {

      async addTask ({name, startTime}) {
        // Ajout de la tache en local
        this.tasks.unshift({
          id : this.getAnID(),
          name, 
          startTime,
          endTime: Date.now(),
        })

        // Ajout de la tache sur l'API
        try {
          await TaskService.updateAll(this.tasks)
        } catch(e) {
          console.log(e)
        }
        
      },

      getAnID () {
        this.taskID++
        return this.taskID
      },

      async deleteTask (taskID) {
        // Récupération de l'index de la tâche
        let taskIndex = null
        this.tasks.forEach((task, index) => {
          if (task.id === taskID) {
            taskIndex = index
          }
        })

        // Suppression de la tâche en local
        this.tasks.splice(taskIndex, 1)

        // mise a jour des taches en API
        try {
          await TaskService.updateAll(this.tasks)
        } catch(e) {
          console.log(e)
        }
      },

      sendRestartTask(taskId) {
        // Récupération du nom de l'ancienne tâche
        let newTaskname = null
        this.tasks.forEach(task => {
          if (task.id === taskId) {
            newTaskname = task.name
          }
        })

        // relancement de la tache
        this.$refs.TheTopTask.restartTask(newTaskname)
      },

    },
  };
</script>

<style lang="scss">
body { margin: 0; }
#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.mainContainer { height: 100%; }

.el-aside {
  height: 100%;
  color: #333;
  border-right: solid 1px #e6e6e6;
}
.el-header {
  padding: 0 !important;
  border-bottom: solid 1px #e6e6e6;
  color: #333;
  line-height: 60px;
  .el-input .el-input__inner {
    border: none !important;
  }
}

</style>