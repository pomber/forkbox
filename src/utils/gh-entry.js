import icons from "./seti-icons.json";

export const getLanguage = filename =>
  filenameRegex.find(x => x.regex.test(filename)).lang;

export const getIcon = path => {
  let iconId = "_tex";
  if (!path) return icons.iconDefinitions[iconId];

  const filename = /([^/]*)$/.exec(path)[1].toLowerCase();
  const extension = /([^.]*)$/.exec(path)[1].toLowerCase();
  const language = getLanguage(filename);

  if (filename in icons.fileNames) {
    iconId = icons.fileNames[filename];
  } else if (extension in icons.fileExtensions) {
    iconId = icons.fileExtensions[extension];
  } else if (language in icons.languageIds) {
    iconId = icons.languageIds[language];
  }

  return icons.iconDefinitions[iconId];
};

const filenameRegex = [
  { lang: "javascript", regex: /\.js$|\.jsx$/i },
  { lang: "json", regex: /\.json$|.baberc$/i },
  { lang: "html", regex: /\.html$|\.htm$/i },
  { lang: "yaml", regex: /\.yaml$|.yml$/i },
  { lang: "bash", regex: /\.sh$/i },
  { lang: "python", regex: /\.py$/i },
  { lang: "sql", regex: /\.sql$/i },
  { lang: "css", regex: /\.css$/i },
  { lang: "less", regex: /\.less$/i },
  { lang: "scss", regex: /\.scss$/i },
  { lang: "ini", regex: /\.ini$|.editorconfig$/i },
  { lang: "xml", regex: /\.xml$/i },
  { lang: "bat", regex: /\.bat$/i },
  { lang: "clojure", regex: /\.clj$/i },
  { lang: "coffeescript", regex: /\.coffee$/i },
  { lang: "cpp", regex: /\.cpp$/i },
  { lang: "csharp", regex: /\.cs$/i },
  { lang: "csp", regex: /\.csp$/i },
  { lang: "dockerfile", regex: /dockerfile$/i },
  { lang: "fsharp", regex: /\.fsharp$/i },
  { lang: "go", regex: /\.go$/i },
  { lang: "handlebars", regex: /\.hbs$/i },
  { lang: "java", regex: /\.java$/i },
  { lang: "lua", regex: /\.lua$/i },
  { lang: "markdown", regex: /\.md$/i },
  { lang: "msdax", regex: /\.msdax$/i },
  { lang: "mysql", regex: /\.mysql$/i },
  { lang: "objective-c", regex: /\.objc$/i },
  { lang: "pgsql", regex: /\.pgsql$/i },
  { lang: "php", regex: /\.php$/i },
  { lang: "postiats", regex: /\.postiats$/i },
  { lang: "powershell", regex: /\.ps$/i },
  { lang: "pug", regex: /\.pug$/i },
  { lang: "r", regex: /\.r$/i },
  { lang: "razor", regex: /\.razor$/i },
  { lang: "ruby", regex: /\.rb$/i },
  { lang: "rust", regex: /\.rs$/i },
  { lang: "small basic", regex: /\.smallbasic$/i },
  { lang: "scheme", regex: /\.scheme$/i },
  { lang: "solidity", regex: /\.solidity$/i },
  { lang: "st", regex: /\.st$/i },
  { lang: "swift", regex: /\.swift$/i },
  { lang: "vb", regex: /\.vb$/i },
  { lang: "plaintext", regex: /.*/i }
];
