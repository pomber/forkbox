import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import FileTree from "./file-tree";
import { LoaderProvider } from "./hitchcock";
import provider from "./mock-provider";

storiesOf("FileTree", module).add("with text", () => (
  <LoaderProvider provider={provider}>
    <FileTree path="/" />
  </LoaderProvider>
));
