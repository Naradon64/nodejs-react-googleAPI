import React, { useRef, useState } from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from "./json_schema_bpmn/info2.json";
import schema2 from "./json_schema_bpmn/info.json";

const Content: React.FC = () => {
  const [schemas, setSchemas] = useState<object[]>([schema1]);
  const formRefs = useRef<(any | null)[]>([]); // Corrected type for formRefs

  const addFormWithSchema1 = () => {
    setSchemas([...schemas, schema1]);
  };

  const addFormWithSchema2 = () => {
    setSchemas([...schemas, schema2]);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const handleSubmitAllForms = () => {
    formRefs.current.forEach((formRef) => {
      if (formRef && typeof formRef.submitForm === "function") {
        formRef.submitForm();
      }
    });
  };

  return (
    <div>
      {schemas.map((schema, index) => (
        <BpmnForm
          key={index}
          ref={(el) => (formRefs.current[index] = el)}
          schema={schema}
          onFormSubmit={handleFormSubmit}
        />
      ))}
      <button onClick={addFormWithSchema1}>Add Form (Schema 1)</button>
      <button onClick={addFormWithSchema2}>Add Form (Schema 2)</button>
      <button onClick={handleSubmitAllForms}>Submit All Forms</button>
    </div>
  );
};

export default Content;
