import { makeFetcher } from "./effects/fetchers.js"
import { makeMonitorStream } from "./effects/monitor-stream.js"
import { makeNdjsonWriter } from "./effects/ndjson-writer.js"
import { startCollector } from "./epics/collector-rx.js"
import { loadConfig } from "./config.js"

const cfg = loadConfig()

const setupCollectors = async client => {
  const fetcher = makeFetcher(client)

  const stoppers = {}

  // here we start data collection epics per each config with corresponding stat fetchers
  for (const f of cfg.epics) {
    let fn, sink
    const nd = makeNdjsonWriter({
      dataDir: cfg.server.data_dir,
      filePrefix: f.file_prefix || f.name
    })
    if(f.type === "monitor"){
      sink = {
        appendRows: async rows => {
          await nd.appendRows(rows, { newFile: true }) // new file per batch
          console.info(`[${f.name}] wrote ${rows.length} logs to ${cfg.server.data_dir}/${f.file_prefix || f.name}`)
        },
        close: nd.close
      }
      const stream$ = makeMonitorStream(async logs => {
        await sink.appendRows(logs)
      }, f)
      const subscription = stream$.subscribe({
        next: logs => console.info(`[${f.name}] monitor cycle complete (${logs.length} logs)`),
        error: err => console.error(`[${f.name}] monitor error:`, err),
        complete: () => console.info(`[${f.name}] monitor completed`),
      })
      stoppers[f.name] = async () => {
        console.info(`[${f.name}] stopping monitor...`)
        subscription.unsubscribe()
        await sink.close()
      }
    }  
    else {
      fn = fetcher[f.type]
      if (!fn) {
        console.warn(`unknown epic type ${f.type} for ${f.name}, skipping`)
        continue
      }
      // write NDJSON files; if we need to ingest into memory for some reason — do it here
      sink = {
        appendRows: async rows => {
          await nd.appendRows(rows)
        },
        close: nd.close
      }

      // collect the first values immediately
      try {
        const rows = await fn()
        await sink.appendRows(rows)
      } catch (e) {
        console.error(`[${f.name}] error`, e?.message || e)
      }

      // then start a corresponding epic to poll on `pollMs` interval
      stoppers[f.name] = startCollector({
        name: f.name,
        pollMs: f.poll_ms,
        fetch: fn,
        writer: sink,
        batchMs: cfg.collector.batch_ms,
        batchMax: cfg.collector.batch_max
      })
    }
}

  return stoppers
}

export { setupCollectors }