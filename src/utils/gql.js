export default (strings, token, variables, mapper) =>
  fetch("https://api.github.com/graphql", {
    method: "post",
    body: JSON.stringify({ query: strings.join(""), variables }),
    headers: new Headers({ authorization: "Bearer " + token })
  })
    .then(r => r.json())
    .then(({ data }) => mapper(data));
