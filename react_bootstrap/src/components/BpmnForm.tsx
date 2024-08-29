import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Form } from "@bpmn-io/form-js";
import { FormEditor } from "@bpmn-io/form-js-editor";
import "@bpmn-io/form-js-viewer/dist/assets/form-js.css";

interface BpmnFormProps {
  schema: object;
  data?: object; // Accept data as a prop
  onFormSubmit?: (data: any) => void;
  onFormCreated?: (form: any) => void;
  isEditor?: boolean; // Add isEditor prop
}

const BpmnForm = forwardRef<
  { submitForm: () => void; saveForm: () => Promise<object | undefined> },
  BpmnFormProps
>(({ schema, data, onFormSubmit, onFormCreated, isEditor }, ref) => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const formInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (isEditor && editorContainerRef.current) {
      const editor = new FormEditor({
        container: editorContainerRef.current,
      });

      editor
        .importSchema(schema)
        .then(() => {
          formInstanceRef.current = editor;
          if (onFormCreated) {
            onFormCreated(editor);
          }
        })
        .catch((err: Error) => {
          console.error("Failed to import form", err);
        });

      return () => {
        editor.destroy();
      };
    } else if (!isEditor && formRef.current) {
      const form = new Form({
        container: formRef.current,
      });

      form.on("submit", (event: any) => {
        if (onFormSubmit) {
          onFormSubmit(event.data);
        }
      });

      form
        .importSchema(schema, data) // Pass data along with the schema
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
  }, [schema, data, onFormSubmit, onFormCreated, isEditor]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formInstanceRef.current && !isEditor) {
        formInstanceRef.current.submit();
      }
    },
    saveForm: async () => {
      if (formInstanceRef.current && isEditor) {
        return formInstanceRef.current.saveSchema();
      }
    },
  }));

  return isEditor ? <div ref={editorContainerRef} /> : <div ref={formRef} />;
});

export default BpmnForm;
