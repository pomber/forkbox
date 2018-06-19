import { configure } from "@storybook/react";
import "../src/primer.css";

function loadStories() {
  const req = require.context("../src", true, /.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
