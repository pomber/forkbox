export default {
  loadTree: path => ({
    hash: () => "tree" + path,
    load: () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve([{ name: "foo" }, { name: "bar.txt" }, { name: "baz.txt" }]);
        }, 1000);
      })
  })
};
