import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

export function MarkdownPage(props){

    return(
        <div className="book-page">
            <article className="markdown">
                <ReactMarkdown
                    remarkPlugins={[remarkMath,[remarkGfm, {singleTilde: false}]]}
                    rehypePlugins={[rehypeKatex]}
                    skipHtml={true}
                    children={props.content}
                />
            </article>
        </div>
    )
}