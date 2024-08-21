<template>
    <div ref="formContainer"></div>
  </template>
  
  <script>
  import { ref, onMounted, defineComponent, toRefs, watch } from 'vue';
  import { Form } from '@bpmn-io/form-js';
  import "@bpmn-io/form-js-viewer/dist/assets/form-js.css";
  
  export default defineComponent({
    name: 'BpmnForm',
    props: {
      schema: Object,
      data: Object,
    },
    emits: ['form-submit'],
    setup(props, { emit }) {
      const formContainer = ref(null);
      const formInstance = ref(null); // Use ref to track the form instance
  
      onMounted(() => {
        if (formContainer.value) {
          formInstance.value = new Form({
            container: formContainer.value,
          });
  
          formInstance.value.on('submit', (event) => {
            emit('form-submit', event.data);
          });
  
          formInstance.value.importSchema(props.schema, props.data).catch(err => {
            console.error('Failed to import schema:', err);
          });
        }
      });
  
      const submitForm = () => {
        if (formInstance.value) {
          formInstance.value.submit();
        } else {
          console.error('Form instance is not initialized');
        }
      };
  
      return {
        formContainer,
        submitForm,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  