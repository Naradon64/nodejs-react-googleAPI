import React, { useEffect, useRef, useState } from "react";
import { FormEditor } from '@bpmn-io/form-js';
import schema1 from "./json_schema_bpmn/info.json";

const FormEdit: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [formEditor, setFormEditor] = useState<FormEditor | null>(null);

  useEffect(() => {
    if (editorContainerRef.current) {
      const editor = new FormEditor({
        container: editorContainerRef.current,
      });
      setFormEditor(editor);

      editor
        .importSchema(schema1)
        .then(() => console.log('Schema imported successfully'))
        .catch((err) => console.error('Importing schema failed', err));

      return () => {
        editor.destroy();
      };
    }
  }, []);

  const handleSave = () => {
    if (formEditor) {
      const exportedSchema = formEditor.saveSchema();
      const schemaJson = JSON.stringify(exportedSchema, null, 2);
      const blob = new Blob([schemaJson], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported-schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  const headerStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: '#333',
  };

  return (
    <div style={{ padding: '20px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <h1 style={headerStyle}>React Form Editor using BPMN.io</h1>
      <div ref={editorContainerRef} style={containerStyle}></div>
      <button onClick={handleSave} style={buttonStyle}>Save Schema</button>
    </div>
  );
};

export default FormEdit;
