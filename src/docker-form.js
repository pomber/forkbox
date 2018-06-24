import React from "react";
import * as S from "./styles";
import * as Icon from "./icons";
import { State } from "./utils/state";
import getDockerFile from "./dockerfile";

const DockerForm = ({ onSubmit, repoUrl, branchName }) => (
  <State
    init={{ platform: "node", version: images["node"][0] }}
    map={(s, ss) => ({
      ...s,
      changeVersion: version => ss({ version }),
      changePlatform: platform =>
        platform !== s.platform &&
        ss({ platform, version: images[platform][0] })
    })}
  >
    {s => (
      <S.DockerForm>
        <S.FormGroup label="Platform">
          <S.Picker>
            {options.map(option => (
              <S.Choice
                {...option}
                selected={s.platform === option.key}
                onSelect={_ => s.changePlatform(option.key)}
              />
            ))}
          </S.Picker>
        </S.FormGroup>
        <S.FormGroup label="Version">
          <S.Select onChange={e => s.changeVersion(e.target.value)}>
            {images[s.platform].map(version => (
              <option
                key={version}
                value={version}
                selected={version === s.version}
              >
                {version}
              </option>
            ))}
          </S.Select>
        </S.FormGroup>
        <p>
          Or <a href="#dockerfile">edit the Dockerfile</a> yourself
        </p>
        <S.FormActions>
          <S.Button
            large
            transparent
            onClick={e =>
              onSubmit(getDockerFile(s.version, repoUrl, branchName))
            }
          >
            Launch Terminal
          </S.Button>
        </S.FormActions>
      </S.DockerForm>
    )}
  </State>
);

const options = [
  {
    key: "python",
    color: "#FFD845",
    icon: <Icon.Python size={0.25} />,
    label: "Python"
  },
  {
    key: "node",
    color: "#83CD29",
    icon: <Icon.NodeJs size={0.25} />,
    label: "NodeJS"
  },
  {
    key: "ruby",
    color: "#D91404",
    icon: <Icon.Ruby size={0.25} />,
    label: "Ruby"
  },
  {
    key: "java",
    color: "#0074BD",
    icon: <Icon.Java size={0.25} />,
    label: "Java"
  },
  {
    key: "cplusplus",
    color: "#9C033A",
    icon: <Icon.Cplusplus size={0.25} />,
    label: "C++"
  },
  {
    key: "csharp",
    color: "#9B4F96",
    icon: <Icon.Csharp size={0.25} />,
    label: "C#"
  },
  {
    key: "php",
    color: "#6181B6",
    icon: <Icon.Php size={0.25} />,
    label: "PHP"
  },
  {
    key: "golang",
    color: "#8CC5E7",
    icon: <Icon.Golang size={0.25} />,
    label: "Go"
  }
];

const images = {
  python: [
    "python:rc-alpine",
    "python:3.6-alpine",
    "python:2.7-alpine",
    "rcarmo/alpine-python:3.6",
    "rcarmo/alpine-python:2.7"
  ],
  node: ["node:10-alpine", "node:9-alpine", "node:8-alpine", "node:6-alpine"],
  ruby: ["ruby:rc-alpine", "ruby:2.5-alpine"],
  java: ["openjdk:8-alpine"],
  cplusplus: ["frolvlad/alpine-gxx"],
  csharp: ["microsoft/dotnet:2.1-sdk-alpine"],
  php: ["php:7.2-alpine"],
  golang: ["golang:1.10-alpine"]
};

export default DockerForm;
