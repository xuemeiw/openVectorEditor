import React from "react";
import {
  DataTable,
  withSelectedEntities,
  CmdCheckbox
} from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";
import { Popover } from "@blueprintjs/core";
import ColorPicker from "./ColorPicker";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import commands from "../../commands";

class FeatureProperties extends React.Component {
  constructor(props) {
    super(props);
    this.commands = commands(this);
  }
  onRowSelect = ([record]) => {
    if (!record) return;
    const { dispatch, editorName } = this.props;
    dispatch({
      type: "SELECTION_LAYER_UPDATE",
      payload: record,
      meta: {
        editorName
      }
    });
  };
  render() {
    const {
      readOnly,
      features = {},
      annotationVisibility,
      sequenceLength,
      featurePropertiesSelectedEntities,
      showAddOrEditFeatureDialog,
      deleteFeature,
      selectedAnnotationId
    } = this.props;

    const featuresToUse = map(features, feature => {
      return {
        ...feature,
        ...(feature.strand === undefined && {
          strand: feature.forward ? 1 : -1
        }),
        size: getRangeLength(feature, sequenceLength)
      };
    });
    return (
      <React.Fragment>
        <DataTable
          topLeftItems={
            <CmdCheckbox prefix="Show " cmd={this.commands.toggleFeatures} />
          }
          annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerenderannotationVisibility={annotationVisibility}
          noPadding
          noFullscreenButton
          onRowSelect={this.onRowSelect}
          maxHeight={400}
          selectedIds={selectedAnnotationId}
          formName="featureProperties"
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              {
                path: "color",
                type: "string",
                render: color => {
                  return (
                    <ColorPickerPopover>
                      <div
                        style={{ height: 20, width: 20, background: color }}
                      />
                    </ColorPickerPopover>
                  );
                }
              },
              { path: "name", type: "string" },
              { path: "type", type: "string" },
              {
                path: "size",
                type: "string",
                render: (val, record) => {
                  const base1Range = convertRangeTo1Based(record);
                  const hasJoinedLocations =
                    record.locations && record.locations.length > 1;

                  return (
                    <span>
                      {val}{" "}
                      <span style={{ fontSize: 10 }}>
                        {hasJoinedLocations ? (
                          record.locations.map((loc, i) => {
                            const base1Range = convertRangeTo1Based(loc);
                            return (
                              <span key={i}>
                                ({base1Range.start}-{base1Range.end})
                              </span>
                            );
                          })
                        ) : (
                          <span>
                            ({base1Range.start}-{base1Range.end})
                          </span>
                        )}
                      </span>
                    </span>
                  );
                }
              },
              { path: "strand", type: "string" }
            ]
          }}
          entities={featuresToUse}
        />
        {!readOnly && (
          <div className="vePropertiesFooter">
            <Button
              style={{ marginRight: 15 }}
              onClick={() => {
                showAddOrEditFeatureDialog();
              }}
            >
              New
            </Button>
            <Button
              onClick={() => {
                showAddOrEditFeatureDialog(
                  featurePropertiesSelectedEntities[0]
                );
              }}
              style={{ marginRight: 15 }}
              disabled={featurePropertiesSelectedEntities.length !== 1}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                deleteFeature(featurePropertiesSelectedEntities);
              }}
              style={{ marginRight: 15 }}
              disabled={!featurePropertiesSelectedEntities.length}
            >
              Delete
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  connectToEditor(
    ({
      readOnly,
      annotationVisibility = {},
      sequenceData: { sequence = "", features = {} } = {}
    }) => {
      return {
        annotationVisibility,
        readOnly,
        features,
        sequenceLength: sequence.length
      };
    }
  ),
  withSelectedEntities("featureProperties")
)(FeatureProperties);

const ColorPickerPopover = ({ readOnly, onColorSelect, children }) => {
  return (
    <Popover
      disabled={readOnly}
      content={<ColorPicker onColorSelect={onColorSelect} />}
    >
      {children}
    </Popover>
  );
};
