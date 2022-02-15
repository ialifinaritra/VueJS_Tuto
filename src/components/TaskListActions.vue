<template>
    <el-button size="small" @click="sendCopyTaskname" icon="el-icon-document-copy" circle></el-button>
    <el-button  size="small" @click="sendRestart" icon="el-icon-video-play" type="primary" circle></el-button>
    <el-button size="small" @click="sendDelete" icon="el-icon-delete" type="danger" circle></el-button>

</template>

<script>
    export default {
        props: {
            taskID: {
                type: Number,
                required: true
            },
        },
        
        emits: ['restart', 'delete', 'copy'],

        methods: {
            sendRestart() {
                this.$emit("restart", this.taskID)
            },
            sendDelete() {
                this.$emit("delete", this.taskID)
            },

            sendCopyTaskname() {
                this.$emit("copyTaskname")
            }
        },
    }
</script>

<style>

</style>