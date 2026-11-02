'use client'

import { CodeComponent } from '@payloadcms/richtext-lexical/client'
import { useField, useFormFields } from '@payloadcms/ui'
import { useRef, useState } from 'react'

type Props = React.ComponentProps<typeof CodeComponent>

const previewSecurityPolicy =
  '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data: blob: https: http:; style-src \'unsafe-inline\' https:; font-src data: https:; frame-src https:">'

const createPreviewDocument = (source: string): string => {
  const isFullDocument = /<html(?:\s|>)/i.test(source)
  let document = isFullDocument
    ? source
    : `<!doctype html><html><head><meta charset="utf-8">${previewSecurityPolicy}</head><body>${source}</body></html>`

  if (isFullDocument) {
    if (/<head(?:\s|>)/i.test(document)) {
      document = document.replace(/<head([^>]*)>/i, `<head$1>${previewSecurityPolicy}`)
    } else {
      document = document.replace(/<html([^>]*)>/i, `<html$1><head>${previewSecurityPolicy}</head>`)
    }

    if (!/<body(?:\s|>)/i.test(document)) {
      document = document.replace(/<\/html\s*>/i, '<body></body></html>')
    }
  }

  return document.replace(/<body([^>]*)>/i, (_match, attributes: string) => {
    const bodyAttributes = attributes.replace(/\scontenteditable(?:=(["']).*?\1|=[^\s>]+)?/i, '')
    return `<body${bodyAttributes} contenteditable="true" spellcheck="false">`
  })
}

const replaceBodyContent = (source: string, bodyContent: string): string => {
  const bodyStart = /<body\b[^>]*>/i.exec(source)
  const bodyEndIndex = source.toLowerCase().lastIndexOf('</body>')

  if (!bodyStart || bodyEndIndex < bodyStart.index + bodyStart[0].length) {
    return bodyContent
  }

  const contentStart = bodyStart.index + bodyStart[0].length
  return source.slice(0, contentStart) + bodyContent + source.slice(bodyEndIndex)
}

const HtmlCodePreviewField = (props: Props) => {
  const [isPreview, setIsPreview] = useState(false)
  const { initialValue, setValue, value } = useField<string>({
    potentiallyStalePath: props.path,
  })
  const language = useFormFields(
    ([fields]) => fields.language?.value ?? fields.language?.initialValue,
  )
  const htmlValue = value ?? initialValue ?? ''
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const sourceValueRef = useRef(htmlValue)
  const [previewDocument, setPreviewDocument] = useState(() => createPreviewDocument(htmlValue))

  if (language !== 'html') {
    return <CodeComponent {...props} />
  }

  const handlePreviewLoad = () => {
    const body = iframeRef.current?.contentDocument?.body
    if (!body) {
      return
    }

    body.setAttribute('aria-label', 'Editable HTML preview')
    sourceValueRef.current = htmlValue
    body.addEventListener('input', () => {
      const updatedValue = replaceBodyContent(sourceValueRef.current, body.innerHTML)
      sourceValueRef.current = updatedValue
      setValue(updatedValue)
    })
  }

  const showPreview = () => {
    sourceValueRef.current = htmlValue
    setPreviewDocument(createPreviewDocument(htmlValue))
    setIsPreview(true)
  }

  const showCode = () => {
    setIsPreview(false)
  }

  return (
    <div className="html-code-preview">
      <div aria-label="HTML editor view" className="html-code-preview__tabs" role="tablist">
        <button
          aria-selected={!isPreview}
          className="html-code-preview__tab"
          onClick={showCode}
          role="tab"
          type="button"
        >
          Code
        </button>
        <button
          aria-selected={isPreview}
          className="html-code-preview__tab"
          onClick={showPreview}
          role="tab"
          type="button"
        >
          Preview
        </button>
      </div>
      {isPreview ? (
        <iframe
          className="html-code-preview__frame"
          onLoad={handlePreviewLoad}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin"
          srcDoc={previewDocument}
          title="Editable HTML preview"
        />
      ) : (
        <CodeComponent {...props} />
      )}
    </div>
  )
}

export default HtmlCodePreviewField
