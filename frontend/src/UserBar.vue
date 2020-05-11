<template lang="pug">
  
    div
        v-toolbar
            v-toolbar-title เว็บ User
            v-toolbar-items
                v-btn(text to="/register") สมัครสมาชิก
                v-btn(text to="/login") ล็อกอิน

        
        v-app
            v-container(fluid)
                router-view

</template>

<script>
export default {
  name: "UserBar",
  data: () => ({
    //
  })
};
</script>

<style scoped>

</style>
