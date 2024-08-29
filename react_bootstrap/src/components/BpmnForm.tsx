import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Form, FormEditor } from "@bpmn-io/form-js";
import "@bpmn-io/form-js-viewer/dist/assets/form-js.css";

interface BpmnFormProps {
  schema: object;
  data?: object;  // Accept data as a prop
  onFormSubmit?: (data: any) => void;
  onFormCreated?: (form: any) => void;
}

const BpmnForm = forwardRef<{ submitForm: () => void }, BpmnFormProps>(
  ({ schema, data, onFormSubmit, onFormCreated }, ref) => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const formInstanceRef = useRef<any>(null);

    useEffect(() => {
      if (formRef.current) {
        const form = new Form({ // edit this line if you want to change to Form Editor
          container: formRef.current,
        });

        form.on("submit", (event: any) => {
          if (onFormSubmit) {
            onFormSubmit(event.data);
          }
        });

        form
          .importSchema(schema, data)  // Pass data along with the schema
          .then(() => {
            formInstanceRef.current = form;
            if (onFormCreated) {
              onFormCreated(form);
            }
          })
          .catch((err: Error) => {
            console.error("Failed to import form", err);
          });

        return () => {
          form.destroy();
        };
      }
    }, [schema, data, onFormSubmit, onFormCreated]);  // Add `data` as a dependency

    // Expose the submitForm method to the parent component
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (formInstanceRef.current) {
          formInstanceRef.current.submit();
        }
      },
    }));

    return <div ref={formRef} />;
  }
);

export default BpmnForm;