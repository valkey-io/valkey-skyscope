import EventEmitter from "events"
import Valkey from "iovalkey"

export const makeMonitorFetcher = (onLogs = async () => {}, config) => {
  const emitter = new EventEmitter()
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  //URL hardcoded for testing 
  const url = String(process.env.VALKEY_URL || cfg.valkey.url || "valkey://host.docker.internal:6379" ).trim()

  let stopped = false
  const monitorClient = new Valkey(url) 

  const monitorRun = async () => {

    const { monitoringInterval, monitoringDuration, maxCommandsPerRun: maxLogs } = config
    const logs = []
    try {
      const monitor = await monitorClient.monitor()
      console.info(`Valkey monitor connected. Running for ${monitoringDuration/1000} seconds or until we capture ${maxLogs} logs`)
      
      const stopPromise = new Promise(resolve => {
        monitor.on("monitor", (_time, args) => {
          logs.push({ ts: Date.now(), command: args.join(" ") })
          if (logs.length >= maxLogs) resolve("maxLogs")
        })
      })

      // Wait until we reach either duration or maxLogs
      const reason = await Promise.race([
        stopPromise,
        sleep(monitoringDuration).then(() => "duration")
      ])

      console.info(`Monitor run complete (${reason}). Collected ${logs.length} logs.`)

      monitor.disconnect()
      if(logs.length > 0) {
        await onLogs(logs)
      }

    emitter.emit("monitorRunComplete", {reason, logs})
    } catch (err) {
      console.error("Monitor error", err)
      try { monitorClient.disconnect() } catch {}
      await sleep(Math.min(5000, 0.5 * monitoringInterval))
    }
    if(!stopped) {
      console.info("Monitor sleeping for ", monitoringInterval/1000, " seconds")
      setTimeout(monitorCycle, config.monitoringInterval)
    }
  }

  monitorRun().catch(err => console.error("Monitor crashed", err))
  emitter.stop = async () => {
    stopped = true
    try {
      monitorClient.disconnect();
    } catch {}
    emitter.emit("stopped");
  }
  return emitter
}
