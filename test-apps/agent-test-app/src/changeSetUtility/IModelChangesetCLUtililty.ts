/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { ChangesetGenerationHarness } from "./ChangesetGenerationHarness";
import { TestChangesetSequence } from "./TestChangesetSequence";
import { ChangeSetUtilityConfig } from "./ChangeSetUtilityConfig";
class ProcessHandler {
    constructor(private _process: NodeJS.Process) { }
    public exitSuccessfully() { this._process.exit(); }
    public exitWithError() { this._process.exit(1); }
}
/** Main entry point for Command Line Utility */
export const main = async (_process: NodeJS.Process, harness: ChangesetGenerationHarness = new ChangesetGenerationHarness()): Promise<void> => {
    const processHandler = new ProcessHandler(_process);
    // Now that the Harness is initalialized, generate changeset sequence
    const changesetSequence: TestChangesetSequence = new TestChangesetSequence(ChangeSetUtilityConfig.numChangesets, ChangeSetUtilityConfig.numCreatedPerChangeset,
        ChangeSetUtilityConfig.changesetPushDelay);
    let success = false;
    try {
        success = await harness.generateChangesets(changesetSequence);
    } catch { }
    if (success)
        processHandler.exitSuccessfully();
    processHandler.exitWithError();
};
// Invoke main if IModelChangesetCLUtility.js is being run directly
if (require.main === module) { main(process); } // tslint:disable-line:no-floating-promises
