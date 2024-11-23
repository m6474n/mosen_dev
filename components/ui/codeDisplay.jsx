
"use client"
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Theme for stylin
import { zTouch,vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';



const CodeDisplay = ({
  code,
  language = "javascript", // Default language
}) => {
  return (
    <div style={{ borderRadius: "8px", overflow: "hidden", }}>
      <SyntaxHighlighter
      
        language={language}
        style={vscDarkPlus} // You can choose a different theme here
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;
