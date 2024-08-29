import React from "react";
import BpmnForm from "./components/BpmnForm";
import schema1 from "./json_schema_bpmn/info2.json";

const FormEdit: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    height: '100%',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    overflow: 'auto',
    margin: '20px 0'
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: '#333',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  };

  return (
    <div style={{ padding: '20px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h1 style={headerStyle}>React Form Editor using BPMN.io</h1>
      <div style={containerStyle}>
        <BpmnForm
          schema={schema1}
          isEditor={true} // Use FormEditor
        />
      </div>
    </div>
  );
};

export default FormEdit;
