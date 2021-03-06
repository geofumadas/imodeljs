/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module WebGL */

import { IDisposable, dispose } from "@bentley/bentleyjs-core";
import { QParams2d, QParams3d } from "@bentley/imodeljs-common";
import { ColorInfo } from "./ColorInfo";
import { TextureHandle } from "./Texture";
import { qparams2dToArray, qorigin3dToArray, qscale3dToArray } from "./Handle";
import { VertexTable, AuxDisplacement, AuxNormal, AuxParam } from "../primitives/VertexTable";

/** Represents the finished lookup table ready for submittal to GPU. */
export class VertexLUT implements IDisposable {
  public readonly texture: TextureHandle; // Texture containing vertex data
  public readonly numVertices: number;
  public readonly numRgbaPerVertex: number;
  public readonly colorInfo: ColorInfo;
  public readonly qOrigin: Float32Array;  // Origin of quantized positions
  public readonly qScale: Float32Array;   // Scale of quantized positions
  public readonly uvQParams?: Float32Array; // If vertices contain texture UV params, quantization parameters as [origin.x, origin.y, scale.x, scale.y ]
  public readonly auxDisplacements?: Map<string, AuxDisplacement>;  // Auxilliary displacements.
  public readonly auxNormals?: Map<string, AuxNormal>;  // Auxilliary displacements.
  public readonly auxParams?: Map<string, AuxParam>;  // Auxilliary displacements.

  public get bytesUsed(): number { return this.texture.bytesUsed; }

  public static createFromVertexTable(vt: VertexTable): VertexLUT | undefined {
    const texture = TextureHandle.createForData(vt.width, vt.height, vt.data);
    return undefined !== texture ? new VertexLUT(texture, vt, ColorInfo.createFromVertexTable(vt), vt.qparams, vt.uvParams) : undefined;
  }

  private constructor(texture: TextureHandle, table: VertexTable, colorInfo: ColorInfo, qparams: QParams3d, uvParams?: QParams2d) {
    this.texture = texture;
    this.numVertices = table.numVertices;
    this.numRgbaPerVertex = table.numRgbaPerVertex;
    this.colorInfo = colorInfo;
    this.qOrigin = qorigin3dToArray(qparams.origin);
    this.qScale = qscale3dToArray(qparams.scale);
    if (undefined !== uvParams)
      this.uvQParams = qparams2dToArray(uvParams);

    if (undefined !== table.auxDisplacements) {
      this.auxDisplacements = new Map<string, AuxDisplacement>();
      for (const auxDisplacement of table.auxDisplacements)
        this.auxDisplacements.set(auxDisplacement.name, auxDisplacement);
    }
    if (undefined !== table.auxParams) {
      this.auxParams = new Map<string, AuxParam>();
      for (const auxParam of table.auxParams)
        this.auxParams.set(auxParam.name, auxParam);
    }
    if (undefined !== table.auxNormals) {
      this.auxNormals = new Map<string, AuxNormal>();
      for (const auxNormal of table.auxNormals)
        this.auxNormals.set(auxNormal.name, auxNormal);
    }
  }

  public dispose() {
    dispose(this.texture);
  }
}
