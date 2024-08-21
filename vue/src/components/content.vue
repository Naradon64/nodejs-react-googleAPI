<template>
    <div>
      <BpmnForm
        v-for="(schema, index) in schemas"
        :key="index"
        :ref="el => formRefs[index] = el"
        :schema="schema"
        @form-submit="handleFormSubmit(index, $event)"
      />
      <button @click="addFormWithSchema1">Add Form (Schema 1)</button>
      <button @click="addFormWithSchema2">Add Form (Schema 2)</button>
      <button @click="handleSubmitAllForms">Submit All Forms</button>
    </div>
</template>
  
<script>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  import BpmnForm from './tools/BpmnForm.vue';
  import schema1 from './json_schema_bpmn/info.json';
  import schema2 from './json_schema_bpmn/info2.json';
  
  export default {
    name: 'Content',
    components: {
      BpmnForm,
    },
    setup() {
      const schemas = reactive([]);
      const formRefs = ref([]);
      const consolidatedFormData = reactive([]);
  
      const addFormWithSchema1 = () => {
        schemas.push(schema1);
      };
  
      const addFormWithSchema2 = () => {
        schemas.push(schema2);
      };
  
      const handleFormSubmit = (index, data) => {
        const schema = schemas[index];
        const formId = schema.id;
  
        consolidatedFormData[index] = {
          formId: formId,
          formData: data,
        };
      };
  
      const handleSubmitAllForms = () => {
        formRefs.value.forEach((formRef, index) => {
          if (formRef && typeof formRef.submitForm === 'function') {
            formRef.submitForm();
          } else {
            console.error(`Form reference at index ${index} is not valid.`);
          }
        });
  
        // Debug consolidatedFormData
        setTimeout(() => {
          console.log('Consolidated Form Data:', consolidatedFormData);
          axios
            .post('http://localhost:5050/submitForms', consolidatedFormData)
            .then((response) => {
              console.log('Success!!!', response.data);
            })
            .catch((error) => {
              console.error('Error submitting forms:', error);
            });
        }, 1000); // Adjust timeout as necessary
      };
  
      return {
        schemas,
        formRefs,
        addFormWithSchema1,
        addFormWithSchema2,
        handleFormSubmit,
        handleSubmitAllForms,
      };
    },
  };
</script>
  
<style scoped>
  /* Add your styles here */
</style>
  