/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { expect } from "chai";
import TestUtils from "../TestUtils";
import { WidgetState, WidgetProps, WidgetDef, ConfigurableUiManager, WidgetControl, ConfigurableCreateInfo, ConfigurableUiControlType } from "../../ui-framework";

describe("WidgetDef", () => {

  class TestWidget extends WidgetControl {
    constructor(info: ConfigurableCreateInfo, options: any) {
      super(info, options);

      this.reactElement = <div />;
    }
  }

  before(async () => {
    await TestUtils.initializeUiFramework();
    ConfigurableUiManager.registerControl("WidgetDefTest", TestWidget);
  });

  it("optional properties", () => {
    const widgetProps: WidgetProps = {
      defaultState: WidgetState.Open,
      priority: 100,
      isFreeform: true,
      iconSpec: "icon-home",
      labelKey: "SampleApp:Test.my-label",
      tooltipKey: "SampleApp:Test.my-tooltip",
      isToolSettings: true,
      isStatusBar: true,
      fillZone: true,
      featureId: "FeatureId",
      isFloatingStateSupported: true,
      isFloatingStateWindowResizable: false,
      applicationData: "AppData",
      element: <div />,
    };
    const widgetDef: WidgetDef = new WidgetDef(widgetProps);

    expect(widgetDef.isVisible).to.eq(true);
    expect(widgetDef.isActive).to.eq(true);
    expect(widgetDef.isFloating).to.eq(false);
    expect(widgetDef.priority).to.eq(100);
    expect(widgetDef.featureId).to.eq("FeatureId");
    expect(widgetDef.isFreeform).to.eq(true);
    expect(widgetDef.isFloatingStateSupported).to.eq(true);
    expect(widgetDef.isFloatingStateWindowResizable).to.eq(false);
    expect(widgetDef.isToolSettings).to.eq(true);
    expect(widgetDef.isStatusBar).to.eq(true);
    expect(widgetDef.fillZone).to.eq(true);
    expect(widgetDef.applicationData).to.eq("AppData");

    expect(widgetDef.label).to.eq("Test.my-label");
    expect(widgetDef.tooltip).to.eq("Test.my-tooltip");
    expect(widgetDef.iconSpec).to.eq("icon-home");
  });

  it("registerControl & widgetControl using same classId", () => {
    const widgetProps: WidgetProps = {
      classId: "WidgetDefTest",
    };
    const widgetDef: WidgetDef = new WidgetDef(widgetProps);

    expect(widgetDef.getWidgetControl(ConfigurableUiControlType.Widget)).to.not.be.undefined;
    expect(widgetDef.reactElement).to.not.be.undefined;
  });

  it("widgetControl using constructor classId", () => {
    const widgetProps: WidgetProps = {
      classId: TestWidget,
    };
    const widgetDef: WidgetDef = new WidgetDef(widgetProps);
    const widgetControl = widgetDef.getWidgetControl(ConfigurableUiControlType.Widget);

    expect(widgetControl).to.not.be.undefined;
    if (widgetControl)
      expect(widgetControl.classId).to.eq("TestWidget");
    expect(widgetDef.reactElement).to.not.be.undefined;
  });

  it("setWidgetState", () => {
    const widgetProps: WidgetProps = {
      classId: "WidgetDefTest",
    };
    const widgetDef: WidgetDef = new WidgetDef(widgetProps);
    widgetDef.setWidgetState(WidgetState.Open);

    expect(widgetDef.isVisible).to.eq(true);
    expect(widgetDef.isActive).to.eq(true);
    expect(widgetDef.canOpen()).to.be.true;
  });

  it("getWidgetControl throws an Error when type is incorrect", () => {
    const widgetProps: WidgetProps = {
      classId: "WidgetDefTest",
    };
    const widgetDef: WidgetDef = new WidgetDef(widgetProps);

    expect(() => widgetDef.getWidgetControl(ConfigurableUiControlType.StatusBarWidget)).to.throw(Error);
  });

});
