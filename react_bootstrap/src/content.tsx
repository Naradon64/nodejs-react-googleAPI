import React, { useRef, useState } from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from "./json_schema_bpmn/info.json";
import schema2 from "./json_schema_bpmn/info2.json";
import axios from "axios";

const Content: React.FC = () => {
  const [schemas, setSchemas] = useState<object[]>([]);
  const formRefs = useRef<(any | null)[]>([]);
  const consolidatedFormData: { formId: string; formData: any }[] = [];

  const addFormWithSchema1 = () => {
    setSchemas([...schemas, schema1]);
  };

  const addFormWithSchema2 = () => {
    setSchemas([...schemas, schema2]);
  };

  const handleFormSubmit = (index: number, data: any) => {
    const schema = schemas[index];
    const formId = (schema as any).id;

    consolidatedFormData[index] = {
      formId: formId,
      formData: data,
    };
  };

  const handleSubmitAllForms = () => {
    formRefs.current.forEach((formRef, index) => {
      if (formRef && typeof formRef.submitForm === "function") {
        formRef.submitForm();
      }
    });

    console.log("Big Form Data:", consolidatedFormData);

    axios
      .post("http://localhost:5050/submitForms", consolidatedFormData)
      .then((response) => {
        console.log("Success!!!", response.data);
      })
      .catch((error) => {
        console.error("Error submitting forms:", error);
      });
  };

  return (
    <div>
      {schemas.map((schema, index) => (
        <BpmnForm
          key={index}
          ref={(el) => (formRefs.current[index] = el)}
          schema={schema}
          onFormSubmit={(data) => handleFormSubmit(index, data)}
        />
      ))}
      <button onClick={addFormWithSchema1}>Add Form (Schema 1)</button>
      <button onClick={addFormWithSchema2}>Add Form (Schema 2)</button>
      <button onClick={handleSubmitAllForms}>Submit All Forms</button>
    </div>
  );
};

export default Content;
