import * as fs from 'fs'
import sources from './source.json'
import superagent from 'superagent'

let counter = 0

async function fetchSource(data: { [x: string]: string }, source: string) {
  for (const name in data) {
    if (Object.prototype.hasOwnProperty.call(data, name)) {
      try {
        const url = data[name as keyof typeof data];
        counter ++

        const json: string = await new Promise((resolve, reject) => {
          const onResponse = (err: any, res: any) => {
            if (err)
              return reject(err)

            resolve(res.text)
          }
          superagent
            .get(url)
            .set('Content-Type', 'application/json')
            .set('User-Agent', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13')
            .end(onResponse)
        })

        console.dir(json)

        if (json) {
          const path = await new Promise((resolve, reject) => {
            const onResponse = (err: any, res: any) => {
              if (err)
                return reject(err)

              resolve(res.text)
            }
            superagent
              .post('https://storage.rottigni.tech/resource/json')
              .set('Content-Type', 'application/json')
              .set('User-Agent', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13')
              .field('payload', json)
              .field('path', `/lord-icon/${source}/`)
              .field('filename', `lord-icon-${name}.json`)
              .end(onResponse)
          })

          console.info(`Emitted: https://storage.rottigni.tech/${path}`)
        } else {
          console.warn('Failed to fetch json.')
        }
      } catch (err) {
        console.error(err)
      }

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
