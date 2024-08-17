import React, { useState } from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from './json_schema_bpmn/info2.json'; // Adjust the path to your schema files
import schema2 from './json_schema_bpmn/info.json'; // Adjust the path to your schema files

const Content: React.FC = () => {
  const [schemas, setSchemas] = useState<object[]>([schema1]); // Array of schemas

  const addFormWithSchema1 = () => {
    setSchemas([...schemas, schema1]);
  };

  const addFormWithSchema2 = () => {
    setSchemas([...schemas, schema2]);
  };

  return (
    <div>
      {schemas.map((schema, index) => (
        <BpmnForm key={index} schema={schema} />
      ))}
      <button onClick={addFormWithSchema1}>Add Form (Schema 1)</button>
      <button onClick={addFormWithSchema2}>Add Form (Schema 2)</button>
    </div>
  );
}

export default Content;