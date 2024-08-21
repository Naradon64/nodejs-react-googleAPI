<template>
    <div>
      <BpmnForm
        v-for="(schema, index) in schemas"
        :key="index"
        :schema="schema"
        :data="formDatas[index]"
      />
      <button @click="addFormWithSchema1">Add Form (Schema 1)</button>
      <button @click="addFormWithSchema2">Add Form (Schema 2)</button>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import BpmnForm from "./tools/BpmnForm.vue";
  import schema1 from "./json_schema_bpmn/info.json";
  import schema2 from "./json_schema_bpmn/info2.json";
  
  export default {
    components: {
      BpmnForm,
    },
    data() {
      return {
        schemas: [],
        formDatas: [],
      };
    },
    methods: {
      addFormWithSchema1() {
        this.schemas.push(schema1);
        axios
          .get("http://localhost:5050/getuserinfo/66c43ba000a1846abf2926bf")
          .then((response) => {
            console.log("Success!!!", response.data);
            this.formDatas.push(response.data);
          })
          .catch((error) => {
            console.error("Error fetching form data:", error);
          });
      },
      addFormWithSchema2() {
        this.schemas.push(schema2);
        axios
          .get("http://localhost:5050/getprefergenre/66c43ba000a1846abf2926bd")
          .then((response) => {
            console.log("Success!!!", response.data);
            this.formDatas.push(response.data);
          })
          .catch((error) => {
            console.error("Error fetching form data:", error);
          });
      },
    },
  };
  </script>