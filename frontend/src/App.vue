<template lang="pug">
  
    div
        v-toolbar
            v-toolbar-title เว็บ
            v-toolbar-items
                v-btn(text to="/") หน้าหลัก
                v-btn(text to="/create") เพิ่มผู้ป่วย
                v-btn(text to="/users") ผู้ใช้
                v-btn(text to="/register") สมัครสมาชิก

        
        v-app
            v-container(fluid)
                router-view

</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  })
};
</script>

<style scoped>

</style>
