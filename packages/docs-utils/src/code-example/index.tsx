type CodeExampleProps = {
  example: string;
  code: string;
};

function CodeExample(props: CodeExampleProps) {
  const { example, code } = props;
  console.log(example);
  console.log(code);
  return <div>Code Example</div>;
}

export default CodeExample;
