import React from "react";
import { MenuBar, commandMenuEnhancer } from "teselagen-react-components";
import { compose } from "redux";
import withEditorInteractions from "../withEditorInteractions";
import menuDef from "./defaultConfig";
import getCommands from "../commands";
import pureNoFunc from "../utils/pureNoFunc";

class OveMenuBar extends React.Component {
  constructor(props) {
    super(props);
    const commands = getCommands(this);
    this.enhancers = [
      commandMenuEnhancer(commands, {
        useTicks: true,
        omitIcons: true
      })
    ];
  }

  render() {
    return (
      <div style={{ display: "flex", height: "100%" }}>
        <MenuBar menu={menuDef} enhancers={this.enhancers} />
        <div
          style={{
            height: "100%",
            width: 2,
            margin: 2,
            background: "lightgrey"
          }}
        />
      </div>
    );
  }
}

export default compose(withEditorInteractions)(pureNoFunc(OveMenuBar));