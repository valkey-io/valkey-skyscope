import { makeFetcher } from "./effects/fetchers.js"
import { makeMonitorStream } from "./effects/monitor-stream.js"
import { makeNdjsonWriter } from "./effects/ndjson-writer.js"
import { startCollector } from "./epics/collector-rx.js"

/*
  State per collector with shape:
  {
    name: string,
    isRunning: boolean,
    lastUpdatedAt: timestamp,
    nextCycleAt: timestamp, // Calculated only for collectors, not the monitor as the monitor is controlled manually
  }
*/
const collectorsState = {}

export const updateCollectorMeta = (name, patch) => {
  const prev = collectorsState[name] || { name }
  const next = { ...prev, ...patch }
  collectorsState[name] = next
  return next
}

// Use it in endpoints to return metadata to server then to UI to show when the data was collected and will be refreshed
export const getCollectorMeta = (name) => collectorsState[name]

const MONITOR = "monitor"
const stoppers = {}

const startMonitor = (cfg) => {
  const nd = makeNdjsonWriter({
    dataDir: cfg.server.data_dir,
    filePrefix: MONITOR
  })

  const monitorEpic = cfg.epics.find(e => e.name === MONITOR)

  const sink = {
    appendRows: async rows => {
      await nd.appendRows(rows)
      console.info(`[${monitorEpic.name}] wrote ${rows.length} logs to ${cfg.server.data_dir}/`)
    },
    close: nd.close
  }

  const now = Date.now()

  updateCollectorMeta(monitorEpic.name, {
    isRunning: true,
    startedAt: Date.now(),
  })

  const stream$ = makeMonitorStream(async logs => {
    await sink.appendRows(logs)
  }, monitorEpic)

  const subscription = stream$.subscribe({
    next: logs => {
      updateCollectorMeta(monitorEpic.name, {
        lastUpdatedAt: Date.now(),
      })
      console.info(`[${monitorEpic.name}] monitor cycle complete (${logs.length} logs)`)
    },
    error: err => {
      updateCollectorMeta(monitorEpic.name, {
        isRunning: false,
        lastErrorAt: Date.now(),
        lastError: String(err),
      })
      console.error(`[${monitorEpic.name}] monitor error:`, err)
    },
    complete: () => {
      updateCollectorMeta(monitorEpic.name, {
        completedAt: Date.now(),
        isRunning: false,
      })
      console.info(`[${monitorEpic.name}] monitor completed`)
    },
  })

  stoppers[monitorEpic.name] = async () => {
    console.info(`[${monitorEpic.name}] stopping monitor...`)
    updateCollectorMeta(monitorEpic.name, {
      stoppedAt: Date.now(),
      isRunning: false,
    })
    subscription.unsubscribe()
    await sink.close()
  }
}

const stopMonitor = async () => await stoppers[MONITOR]()

const setupCollectors = async (client, cfg) => {
  const fetcher = makeFetcher(client)
  const stoppers = {}
  await Promise.all(cfg.epics
    .filter(f => f.name !== MONITOR && fetcher[f.type])
    .map(async f => {
      const fn = fetcher[f.type]
      const nd = makeNdjsonWriter({
        dataDir: cfg.server.data_dir,
        filePrefix: f.file_prefix || f.name
      })

      updateCollectorMeta(f.name, {
        isRunning: true,
        startedAt: Date.now(),
        lastUpdatedAt: null,
        nextCycleAt: Date.now() + f.poll_ms,
      })

      const sink = {
        appendRows: async rows => {
          nd.appendRows(rows)
          updateCollectorMeta(f.name, {
            lastUpdatedAt: Date.now(),
          })
        },
        close: () => {
          updateCollectorMeta(f.name, {
            isRunning: false,
            stoppedAt: Date.now()
          })
          nd.close
        }
      }

      const rows = await fn()

      await sink.appendRows(rows)
      stoppers[f.name] = startCollector({
        name: f.name,
        pollMs: f.poll_ms,
        fetch: fn,
        writer: sink,
        batchMs: cfg.collector.batch_ms,
        batchMax: cfg.collector.batch_max
      })
    })
  )
  return stoppers
}

export { setupCollectors, startMonitor, stopMonitor }
