import React, {Component} from 'react';

export default class PreviewArticle extends Component {
    
    decodeContent = (mainContent) => {
        if (mainContent === '<p></p>') {
            return(
                <div className="preview-article-maincontent">
                    <span className="error-warning">正文内容为空 !</span>
                </div>
            );
        }

        return(
            <div
                className="preview-article-maincontent"
                dangerouslySetInnerHTML={{ __html: mainContent}}
            />
        );
    }

    render() {
        const {title, mainContent} = this.props;
        console.log(mainContent.length);
        console.log(mainContent === "<p></p>");

        return (
            <div className="preview-article-page">
                <div className="preview-article-title ellipsis">
                    {title}
                    <div className="preview-article-author">Silvia | 2019-01-19 </div>
                </div>

                {
                    this.decodeContent(mainContent)
                }
            </div>
        );
    }
}
