// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { provideReactWrapper } from '@microsoft/fast-react-wrapper';
import * as webviewUI from "@vscode/webview-ui-toolkit";
import * as React from "react";
import { JavaRuntimeEntry, ProjectRuntimeEntry } from "../../types";
import { setDefaultRuntime } from "../vscode.api";

const { wrap } = provideReactWrapper(React);
const Button = wrap(webviewUI.VSCodeButton);

interface Props {
  jdkEntries: JavaRuntimeEntry[];
  projectRuntime: ProjectRuntimeEntry;
}

interface State {
  isEditing: boolean;
}

export class DefaultJDKSelector extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  render = () => {
    const { jdkEntries, projectRuntime: p } = this.props;
    const { isEditing } = this.state;
    return (
      <div className="inline-flex">
        { isEditing ? 
          <select className="jdkDropdown" id="jdkDropdown" defaultValue={p.runtimePath} onChange={this.onSelectionChange}>
            {jdkEntries.map(jdk => (
              <option key={jdk.name} value={jdk.fspath}>{jdk.majorVersion} - {jdk.name}</option>
            ))}
          </select>
          : 
          <span>{p.sourceLevel}</span>
        }
        <Button appearance="icon" onClick={() => this.onClickEdit()} title="Edit"><span className="codicon codicon-edit"></span></Button>
      </div>
    );
  }

  onSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setIsEditing(false);
    const { value } = event.target;
    const targetJdk = this.props.jdkEntries.find(jdk => jdk.fspath === value);
    if (targetJdk) {
      setDefaultRuntime(targetJdk.fspath, targetJdk.majorVersion);
    }
  }

  onClickEdit = () => {
    this.setIsEditing(true);
  }

  setIsEditing = (isEditing: boolean) => {
    this.setState({
      isEditing
    })
  }
}