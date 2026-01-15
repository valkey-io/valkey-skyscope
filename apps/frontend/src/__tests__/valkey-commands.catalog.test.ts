/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import valkeyCommands from "../data/valkey-commands.json"

describe("Valkey Command Catalog Snapshot", () => {
  it("should match the expected command catalog structure", () => {
    expect(valkeyCommands).toMatchSnapshot()
  })

  it("should have expected number of commands per tier", () => {
    const commandsByTier = {
      default: valkeyCommands.filter((c: any) => c.tier === "default").length,
      remediation: valkeyCommands.filter((c: any) => c.tier === "remediation").length,
      admin: valkeyCommands.filter((c: any) => c.tier === "admin").length,
    }

    expect(commandsByTier).toMatchSnapshot()
  })

  it("should have expected command names per tier", () => {
    const commandNamesByTier = {
      default: valkeyCommands
        .filter((c: any) => c.tier === "default")
        .map((c: any) => c.name)
        .sort(),
      remediation: valkeyCommands
        .filter((c: any) => c.tier === "remediation")
        .map((c: any) => c.name)
        .sort(),
      admin: valkeyCommands
        .filter((c: any) => c.tier === "admin")
        .map((c: any) => c.name)
        .sort(),
    }

    expect(commandNamesByTier).toMatchSnapshot()
  })

  it("should have expected categories", () => {
    const categories = [...new Set(valkeyCommands.map((c: any) => c.category))].sort()

    expect(categories).toMatchSnapshot()
  })
})
