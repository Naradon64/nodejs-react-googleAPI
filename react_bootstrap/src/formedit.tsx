import { useRef } from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from "./json_schema_bpmn/info2.json";
import { saveAs } from "file-saver";

const FormEdit = () => {
  const formRef = useRef<any>(null);

  const handleSave = async () => {
    if (formRef.current) {
      const newSchema = await formRef.current.saveForm();
      if (newSchema) {
        const blob = new Blob([JSON.stringify(newSchema, null, 2)], {
          type: "application/json",
        });
        saveAs(blob, "form-schema.json");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h1>React Form Editor using BPMN.io</h1>
      <button onClick={handleSave}>Save Schema</button>
      <div
        style={{
          height: "100%",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9f9f9",
          overflow: "auto",
          margin: "20px 0",
        }}
      >
        <BpmnForm ref={formRef} schema={schema1} isEditor={true} />
      </div>
    </div>
  );
};

export default FormEdit;
