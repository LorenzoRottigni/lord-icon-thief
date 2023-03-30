import * as fs from 'fs'
import sources from './source.json'

let counter = 0

async function fetchSource(data: { [x: string]: string }, source: string) {
  for (const name in data) {
    if (Object.prototype.hasOwnProperty.call(data, name)) {
      counter ++
      const url = data[name as keyof typeof data];
      const res = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        }
      )
      const body = {
        payload: JSON.stringify(await res.json()),
        path: `/lord-icon/${source}/`,
        filename: `lord_icon_${name}.json`
      }
      console.dir(body)
      const path = await fetch(
        'https://storage.rottigni.tech/resource/json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
        },
      )

      console.info(`Emitted: https://storage.rottigni.tech/${await path.text()}`)
      /*await fs.writeFile(
        `./data/${source}/lord_icon_${name}.json`,
        JSON.stringify(await res.json()),
        (err: any) => {
          if (err) console.error(err)
          else console.info(`Emitted: ./data/${source}/${name}.json`)
        }
      )*/
    }
  }
}

async function main() {
  for (const source in sources) {
    if (Object.prototype.hasOwnProperty.call(sources, source)) {
      await fetchSource(
        sources[source as keyof typeof sources] as unknown as { [x: string]: string },
        source
      )
    }
  }
}

main()
  .then(() => {
    console.info(`Downloaded ${counter} icons.`)
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
