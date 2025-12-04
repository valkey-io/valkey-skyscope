import * as R from 'ramda'
import * as Streamer from '../effects/ndjson-streamer.js'

export const calculateHotKeys = async (client) => {
  const rows = await Streamer.monitor()
  const ACCESS_COMMANDS = ["get", "set", "mget", "hget", "hgetall", "hmget", "json.get", "json.mget"]
  const CUT_OFF_FREQUENCY = 1

  const hotKeyPairs = R.pipe(
    R.reduce((acc, { ts, command }) => {
      const [cmd, ...args] = command.split(' ').filter(Boolean)
      if (ACCESS_COMMANDS.includes(cmd.trim().toLowerCase())) {
        args.forEach(key => {
          acc[key] = acc[key] ? acc[key] + 1 : 1
        })
      }
      return acc
    }, {}),
    R.toPairs,
    R.sort(R.descend(R.last)),
    R.reject(([key, count]) => count <= CUT_OFF_FREQUENCY)
  )(rows)

  // enrich hot keys with TTL and Size of the key
  const enrichedHotKeys = await Promise.all(
    hotKeyPairs.map(async ([keyName, count]) => {
      try {
        const [size, ttl] = await Promise.all([
          client.memoryUsage(keyName).catch(() => null),
          client.ttl(keyName).catch(() => -1)
        ])

        return [keyName, count, size, ttl]
      } catch (error) {
        console.error(`Error fetching data for the key ${keyName}:`, error)
        return [keyName, count, null, -1]
      }
    })
  )

  return enrichedHotKeys
}

