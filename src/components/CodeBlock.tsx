import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'

type CodeBlockProps = {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current)
    }
  }, [code, language])

  return (
    <pre className="my-4 overflow-x-auto rounded-lg bg-[#2d2d2d] p-4 text-sm">
      <code ref={ref} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  )
}
