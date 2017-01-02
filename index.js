/* Example

  var template = `
  <ul>
      <% for(var i=0; i<data.supplies.length; i++) {%>
          <li><%= data.numbers[i] %></li>
      <% } %>
  </ul>
  `;

  const parse = eval(compile(template));

  console.log(parse);

  document.getElementById('output').innerHTML = parse({ numbers: ['one', 'two', 'three'] });
*/

function compile(template) {
  // Evaluations can only be on one line
  // Matches anything between <%= and %> except line breaks
  const evalExpr = /\<\%\=(.+?)\%\>/g;

  // Expressions can be on any number of lines
  const expr  = /\<\%([\s\S]+?)\%\>/g;

  // Empty echos
  const empty = /echo\(\"\"\);/g;

  template = template
    // Replace all evaluations with echo calls or their contents
    .replace(evalExpr, '`); \n  echo($1); \n  echo(`')
    // Replace <% in expressions with `");`
    // and %> in expressions with `echo("`
    .replace(expr, '`); \n $1 \n echo(`');

  // Wrap the whole thing in an echo
  template = 'echo(`' + template + '`);';

  // Remove empty echos
  template = template
    .replace(empty, '');

  // Stores the JavaScript text to be written to be returned
  const script =
`(function parse(data) {
  // Stores the parsed template
  let output = '';

  // Appends html to the parsed template
  function echo(html) {
    output += html;
  }

  // Contains echos, etc.
  ${template}

  return output;
})`;

  return script;
}
