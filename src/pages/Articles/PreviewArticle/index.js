import React, {Component} from 'react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';



export default class PreviewArticle extends Component {
    decodeContent = (mainContent) => {
        const blocksFromHtml = htmlToDraft(mainContent);
        console.log(blocksFromHtml);
        // const { contentBlocks, entityMap } = blocksFromHtml;
        // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        // const editorState = EditorState.createWithContent(contentState);
        return(
            blocksFromHtml
        );
    }

    render() {
        const {title, mainContent} = this.props;

        return (
            <div className="preview-article-page">
                <div>{title}</div>
                {
                    this.decodeContent(mainContent)
                }
            </div>
        );
    }
}
