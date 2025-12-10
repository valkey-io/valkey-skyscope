export const getHotSlots = async (client, limit = 50) => {
  try {
    const rawSlots = await client.sendCommand(
      ["CLUSTER", "SLOT-STATS", "ORDERBY", "CPU-USEC", "LIMIT", limit],
    )

    const filteredSlots = {}

    rawSlots.forEach((slot) => {
      const slotStats = slot[1]
      const cpuIndex = slotStats.indexOf("cpu-usec")
      if (cpuIndex !== -1) {
        const cpuUsec = slotStats[cpuIndex + 1]
        if (cpuUsec > 0) filteredSlots[slot[0]] = cpuUsec
      }
    })
    return filteredSlots
  } catch (error) {
    console.error("Error retrieving slots: ", error)
  }
}

