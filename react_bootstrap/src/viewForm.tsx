import React, { useRef, useState } from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from "./json_schema_bpmn/info.json";
import schema2 from "./json_schema_bpmn/info2.json";
import axios from "axios";

const ViewForm: React.FC = () => {
  const [schemas, setSchemas] = useState<object[]>([]);
  const [formDatas, setFormDatas] = useState<Array<object | undefined>>([]); // Array to hold data for each form
  const formRefs = useRef<(any | null)[]>([]);

  const addFormWithSchema1 = () => {
    setSchemas([...schemas, schema1]);
    axios
      .get("http://localhost:5050/getuserinfo/66c43ba000a1846abf2926bf")
      .then((response) => {
        console.log("Success!!!", response.data);
        setFormDatas((prevFormDatas) => [...prevFormDatas, response.data]); // Add the fetched data to the array
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  };

  const addFormWithSchema2 = () => {
    setSchemas([...schemas, schema2]);
    axios
      .get("http://localhost:5050/getprefergenre/66c43ba000a1846abf2926bd")
      .then((response) => {
        console.log("Success!!!", response.data);
        setFormDatas((prevFormDatas) => [...prevFormDatas, response.data]); // Add the fetched data to the array
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
      });
  };

  return (
    <div>
      {schemas.map((schema, index) => (
        <BpmnForm
          key={index}
          ref={(el) => (formRefs.current[index] = el)}
          schema={schema}
          data={formDatas[index]}  // Pass the specific data for this form
        />
      ))}
      <button onClick={addFormWithSchema1}>Add Form (Schema 1)</button>
      <button onClick={addFormWithSchema2}>Add Form (Schema 2)</button>
    </div>
  );
};

export default ViewForm;