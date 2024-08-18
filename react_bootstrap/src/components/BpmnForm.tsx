import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Form } from "@bpmn-io/form-js";
import "@bpmn-io/form-js-viewer/dist/assets/form-js.css";

interface BpmnFormProps {
  schema: object;
  onFormSubmit?: (data: any) => void;
  onFormCreated?: (form: any) => void;
}

const BpmnForm = forwardRef<{ submitForm: () => void }, BpmnFormProps>(
  ({ schema, onFormSubmit, onFormCreated }, ref) => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const formInstanceRef = useRef<any>(null);

    useEffect(() => {
      if (formRef.current) {
        const form = new Form({
          container: formRef.current,
        });

        form.on("submit", (event: any) => {
          if (onFormSubmit) {
            onFormSubmit(event.data);
          }
        });

        form
          .importSchema(schema)
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
    }, [schema, onFormSubmit, onFormCreated]);

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
