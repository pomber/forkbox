import React from "react";
import * as S from "./styles";

const TerminalPanel = ({}) => (
  <S.TerminalPanel>
    <S.DockerForm>
      <S.FormGroup label="Platform">Foo</S.FormGroup>
      <S.FormGroup label="Version">
        <S.Select>
          <option>node:10-alpine</option>
          <option>node:9-alpine</option>
        </S.Select>
      </S.FormGroup>
      <p>
        Or <a href="#dockerfile">edit the Dockerfile</a> yourself
      </p>
      <S.FormActions>
        <S.Button large transparent>
          Launch Terminal
        </S.Button>
      </S.FormActions>
    </S.DockerForm>
  </S.TerminalPanel>
);

export default TerminalPanel;
