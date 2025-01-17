import { nanoid } from 'nanoid'
import path from 'path'
import {
  loadingStyleTag as circularLoadingStyleTag,
  loadingTag as circularLoadingTag,
  setMsg as setMsg_,
  addMsg as addMsg_,
} from './loading-circular.js'
import {
  loadingStyleTag as linearLoadingStyleTag,
  loadingTag as linearLoadingTag,
} from './loading-linear.js'

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV !== 'production'

if (!window.Worker) {
  throw new Error(
    "Web workers are not supported in this browser. ESM-X may support workflows that don't require web workers in the future - please request this if you see this error",
  )
}


const scriptURL = document.currentScript.src
const compiler = new Worker(
  URL.createObjectURL(
    new Blob(
      [
        `import("${
          scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1) +
          `scripts/${isDev ? 'dev.' : ''}compiler.js`
        }");`,
      ],
      {
        type: 'application/javascript; charset=utf8',
      },
    ),
  ),
  { type: 'module' },
)

const loadingConfig = {
  disabled: { style: undefined, tag: undefined },
  circular: {
    style: circularLoadingStyleTag,
    tag: circularLoadingTag,
  },
  linear: {
    style: linearLoadingStyleTag,
    tag: linearLoadingTag,
  },
}

const setMsg = typeof setMsg_ === 'undefined' ? undefined : setMsg_
const addMsg = typeof setMsg_ === 'undefined' ? undefined : addMsg_

window.process = window.process || {}
window.process.env = window.process.env || {}
window.exports = window.exports || {}

const loadingType =
  document.querySelector('script[id="esm-x"]')?.attributes?.loading?.value || 'circular'
const compilerType =
  document.querySelector('script[id="esm-x"]')?.attributes?.compiler?.value || 'babel'
const { style: loadingStyle, tag: loadingTag } = loadingConfig[loadingType]

if (isDev) {
  console.info('Using compiler', compilerType)
}

const debounce = (cb, duration = 0) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

const showLoading = tag => tag?.classList.add('esm-x-active')
const hideLoading = debounce(
  tag => tag?.classList.remove('esm-x-active'),
  loadingType === 'linear' ? 100 : 1000,
)

async function transpile({
  url,
  source,
  filename = path.basename(new URL(url).pathname),
  compilerType,
}) {
  if (isDev) {
    console.info('Transpiling', filename)
  }

  return new Promise((resolve, reject) => {
    try {
      const id = nanoid()

      const handleMessage = e => {
        const { id: _id, transformed } = e.data

        if (_id === id) {
          compiler.removeEventListener('message', handleMessage)
          resolve(transformed)
        }
      }

      compiler.addEventListener('message', handleMessage)
      compiler.postMessage({ id, filename, source, compilerType })
    } catch (e) {
      reject(e)
    }
  })
}

function initializeESModulesShim(loadingTag, compilerType) {
  const { fetch: _, shimMode: __, resolve: ___, ...otherOptions } = globalThis.esmsInitOptions || {}

  globalThis.esmsInitOptions = {
    shimMode: true,
    async fetch(url, options) {
      showLoading(loadingTag)
      if (addMsg) {
        addMsg(`${url}`)
      }
      try {
        const res = await fetch(url, options)
        if (!res.ok) return res

        /**
         * importmap files need to be handled by es-module-shims, all code
         * from the origin is treated as needing to be transpiled
         */
        const isImportMapFile = url.endsWith('importmap') || url.endsWith('importmap.json')
        const isSameOrigin = url.includes(globalThis.origin)
        if (!isImportMapFile && isSameOrigin) {
          const source = await res.text()
          const transformed = await transpile({ url, source, compilerType })
          return new Response(new Blob([transformed], { type: 'application/javascript' }))
        }
        return res
      } catch (e) {
        console.error(e)
      } finally {
        hideLoading(loadingTag)
      }
    },
    resolve(id, parentUrl, resolve) {
      if (id.startsWith('./') && !parentUrl) {
        const url = window.location.href
        const newUrl = url.substring(0, url.lastIndexOf('/') + 1) + id.replace('./', '')
        return newUrl
      }
      return resolve(id, parentUrl, resolve)
    },
    ...otherOptions,
  }
}

function normalizeImportmap() {
  const importmap =
    document.querySelector('script[type="importmap"]') ||
    document.querySelector('script[type="importmap-shim"]')

  if (!importmap) {
    console.warn("importmap not detected. This is fine, but obviously imports won't work")
  }

  if (importmap) {
    const content = importmap.innerHTML

    // Ensure there's a script type="importmap"
    let importmapScript = document.querySelector('script[type="importmap"]')
    if (!importmapScript) {
      importmapScript = document.createElement('script')
      importmapScript.setAttribute('type', 'importmap')
      importmapScript.innerHTML = content
      importmap.parentNode.insertBefore(importmapScript, importmap)
    } else {
      importmapScript.innerHTML = content
    }

    // Ensure there's a script type="importmap-shim"
    let importmapShimScript = document.querySelector('script[type="importmap-shim"]')
    if (!importmapShimScript) {
      importmapShimScript = document.createElement('script')
      importmapShimScript.setAttribute('type', 'importmap-shim')
      importmapShimScript.innerHTML = content
      importmap.parentNode.insertBefore(importmapShimScript, importmap)
    } else {
      importmapShimScript.innerHTML = content
    }
  }
}

async function transpileXModule(compilerType) {
  const scripts = Array.from(document.querySelectorAll('script[type="esm-x"]'))

  const createAndInsertNewScript = async (script, i) => {
    const newScript = document.createElement('script')
    newScript.type = 'module-shim'
    newScript.innerHTML = await transpile({
      filename: `script-${i}.tsx`,
      source: script.innerHTML,
      compilerType,
    })
    script.insertAdjacentElement('afterend', newScript)
  }

  await Promise.all(scripts.map(createAndInsertNewScript))
}

function initializePage(loadingStyle, loadingTag, compilerType) {
  document.addEventListener(
    'DOMContentLoaded',
    async () => {
      if (loadingStyle && loadingTag) {
        if (!document.getElementById('esm-x-loading-style')) {
          document.head.appendChild(loadingStyle)
        }
        if (!document.getElementById('esm-x-loading')) {
          document.body.appendChild(loadingTag)
        }
      }

      normalizeImportmap()

      // Wait for transpiler to load
      await new Promise(resolve => {
        compiler.addEventListener('message', resolve, { once: true })
      })

      await transpileXModule(compilerType)
      hideLoading(loadingTag)
    },
    /**
     * https://github.com/guybedford/es-module-shims#no-load-event-retriggers
     * Seems like it's a better option to explicitly handle this just for this
     * script
     */
    { once: true },
  )
}

const knownCompilers = ['esbuild', 'babel']

if (!knownCompilers.map(s => s.toLowerCase()).includes(compilerType?.toLowerCase())) {
  throw new Error(`Unknown compiler specified. Choose between [${knownCompilers.join(', ')}]`)
}

// Initial setup
showLoading(loadingTag)
addMsg('Loading esm-x')
initializeESModulesShim(loadingTag, compilerType)
initializePage(loadingStyle, loadingTag, compilerType)
