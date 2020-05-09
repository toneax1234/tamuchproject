<template lang="pug">
    
    v-row

        v-col(md="6" offset-md="2")

            v-text-field(
                label="Name"
                v-model="name"
            )

            v-text-field(
                label="Weight"
                v-model="weight"
            )

            v-text-field(
                label="Age"
                v-model="age"
            )

         

            v-btn(color="success" @click="update") ยืนยันการแก้ไข

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "update",
  data() {
    return {
      name: "",
      weight: 0,
      age : 0
    };
  },
  computed: {
    ...mapState({
      raw_resource_types: state => state.raw_resource_types
    })
  },
  methods: {
    async update() {
      const vm = this;

      await vm.$store.dispatch("update", {
        id: vm.$route.params.id,
        data: {
          name: vm.name,
          weight: vm.weight,
          age: vm.age
        }
      });

      vm.$router.push({ path: "/" });
    }
  },
  async mounted() {
    const vm = this;

    const data = await vm.$store.dispatch("get", vm.$route.params.id);

    vm.name = data.name;
    vm.weight = data.weight;
    vm.age = data.age;
  }
};
</script>