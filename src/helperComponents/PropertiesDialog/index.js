import React from "react";
import { compose } from "redux";
import { Tab, Tabs } from "@blueprintjs/core";
import { startCase } from "lodash";
import FeatureProperties from "./FeatureProperties";
import GeneralProperties from "./GeneralProperties";
import CutsiteProperties from "./CutsiteProperties";
import OrfProperties from "./OrfProperties";
import GenbankView from "./GenbankView";
import TranslationProperties from "./TranslationProperties";
import PrimerProperties from "./PrimerProperties";
import PartProperties from "./PartProperties";
import { connectToEditor } from "../../withEditorProps";
import "./style.css";

const allTabs = {
  general: GeneralProperties,
  features: FeatureProperties,
  parts: PartProperties,
  primers: PrimerProperties,
  translations: TranslationProperties,
  cutsites: CutsiteProperties,
  orfs: OrfProperties,
  genbank: GenbankView
};
export class PropertiesInner extends React.Component {
  render() {
    const {
      propertiesTool = {},
      propertiesViewTabUpdate,
      dimensions = {},
      height,
      editorName,
      onSave,
      showReadOnly,
      showAvailability,
      disableSetReadOnly,
      propertiesList = [
        "general",
        "features",
        "parts",
        "primers",
        "translations",
        "cutsites",
        "orfs",
        "genbank"
      ],
      closePanelButton
    } = this.props;

    const { width, height: heightFromDim } = dimensions;

    let { tabId, selectedAnnotationId } = propertiesTool;
    if (propertiesList.indexOf(tabId) === -1) {
      tabId = propertiesList[0];
    }
    const propertiesTabs = propertiesList.map(name => {
      const Comp = allTabs[name];
      return (
        <Tab
          key={name}
          title={name === "orfs" ? "ORFs" : startCase(name)}
          id={name}
          panel={
            <Comp
              {...{
                editorName,
                onSave,
                showReadOnly,
                showAvailability,
                disableSetReadOnly,
                selectedAnnotationId
              }}
            />
          }
        />
      );
    });

    return (
      <div
        style={{
          position: "relative"
        }}
      >
        {closePanelButton}
        <div
          className="ve-propertiesPanel"
          style={{
            display: "flex",
            width,
            height: Math.max(0, Number((heightFromDim || height) - 30)),
            zIndex: 10,
            padding: 10
            // paddingBottom: '31px',
          }}
        >
          {propertiesTabs.length ? (
            <Tabs
              style={{ width }}
              renderActiveTabPanelOnly
              selectedTabId={tabId}
              onChange={propertiesViewTabUpdate}
            >
              <Tabs.Expander />
              {propertiesTabs}
              <Tabs.Expander />
            </Tabs>
          ) : (
            <div style={{ margin: 20, fontSize: 20 }}>
              No Properties to display
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connectToEditor(({ propertiesTool }) => {
    return { propertiesTool };
  })
)(PropertiesInner);