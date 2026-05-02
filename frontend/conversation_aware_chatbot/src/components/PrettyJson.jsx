// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


// const PrettyJson = ({ data }) => {
//   return (
//     <pre className="text-[#cbd5f5] p-4 rounded-lg overflow-auto text-sm break-all whitespace-pre-wrap">
//       {JSON.stringify(data, null, 2)}
//     </pre>
//   );
// };

// export default PrettyJson


import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const customTheme = {
  'code[class*="language-"]': {
    color: "#cbd5f5",
    background: "#020617", // ✅ your desired background
    fontFamily: "monospace",
    fontSize: "14px",
  },

  'pre[class*="language-"]': {
    background: "#020617", // ✅ important for outer container
    margin: 0,
    padding: "16px",
    borderRadius: "12px",
  },

  property: { color: "#64748B" },       // keys
  string: { color: "#89CEFF" },     // values
  number: { color: "#34d399" },
  boolean: { color: "#c084fc" },
  punctuation: { color: "#818CF8" },
};

const PrettyJson = ({ data }) => {
  return (
    <SyntaxHighlighter language="json" style={customTheme} wrapLongLines={true}>
      {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
  );
};

export default PrettyJson;