import React, { useEffect, useRef } from "react";
import { Form } from '@bpmn-io/form-js';
import '@bpmn-io/form-js-viewer/dist/assets/form-js.css';

interface BpmnFormProps {
  schema: object; // Replace 'object' with a more specific type if your schema has a defined structure
}

const BpmnForm: React.FC<BpmnFormProps> = ({ schema }) => {
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      const form = new Form({
        container: formRef.current
      });

      form.on('submit', (event: any) => {
        console.log(event.data, event.errors);
      });

      form.importSchema(schema).catch((err: Error) => {
        console.error('Failed to import form', err);
      });

      return () => {
        form.destroy();
      };
    }
  }, [schema]); // Re-run the effect if the schema changes

  return <div ref={formRef} />;
};

export default BpmnForm;