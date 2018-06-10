import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import FileTree from "./file-tree";

storiesOf("FileTree", module).add("with text", () => <FileTree path="/" />);
