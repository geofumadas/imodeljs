/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import TestUtils from "../TestUtils";
import { Task } from "../../ui-framework";

describe("Task", () => {

  before(async () => {
    await TestUtils.initializeUiFramework();
  });

  it("toolbarReactNode should return null", () => {
    const task = new Task({
      id: "Task1",
      primaryStageId: "Test1",
      iconSpec: "icon-placeholder",
      labelKey: "SampleApp:backstage.task1",
    });

    expect(task.toolbarReactNode(0)).to.be.null;

    task.execute(); // simply for coverage - no-op
  });

});
