import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import PreviewArticle from './PreviewArticle';
import {message, Icon} from 'antd';

@inject('stores')
@observer
class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            stages: "three",
            title: '',
            mainContent: '',
            surfaceImage: '',
        };
    }

    initStatus = () => {

    }

    componentWillUnmount() {

    }

    componentDidMount() {
        this.initStatus();
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    }

    updateImage = async () => {

    }

    uploadImageCallBack = (file) => {
        console.log(file);
    }

    isOneStage(stage) {
        if (this.state.stages === stage) {
            return true;
        }

        return false;
    }

    cancelArticle = () => {

    }

    navagatePreviewArticle = () => {
        const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())).trim();
        
        if (this.isOneStage("one")) {
            if(!this.state.title) {
                return message.warning("title is required !");
            }

            this.setState({
                stages: 'two',
                mainContent: value,
            });
        }

    }

    navigateEditroArticle = () => {
        if (this.isOneStage("two")) {
            this.setState({
                stages: 'one',
            });
        }
    }

    titleChange = (event) => {
        if (this.isOneStage("one")) {
            this.setState({
                title: event.target.value,
            });
        }
    }

    navigatePreviewArticle = () => {
        if (this.isOneStage("three")) {
            this.setState({
                stages: 'two',
            });
        }
    }

    navigatePublishPage = () => {
        if (this.isOneStage("two")) {
            this.setState({
                stages: 'three',
            });
        }
    }

    addArticleLabel = () => {

    }

    uploadSurfaceImg = () => {
        console.log("upload surface image");
    }

    renderHeaderCommon() {
        if (this.state.stages === "one") {
            return(
                <div className="header-wrapper">
                    <span className="left-text" onClick={this.cancelArticle}>
                        <Icon type="left" style={{fontSize: "16px", color: '#888', fontWeight: "bold"}} />
                    </span>
                    <span className="center-text">发表文章</span>
                    <span className="right-text" onClick={this.navagatePreviewArticle}>下一步</span>
                </div>
            );
        } else if (this.state.stages === "two") {
            return(
                <div className="header-wrapper">
                    <span className="left-text" onClick={this.navigateEditroArticle}>继续编辑</span>
                    <span className="center-text">预 览</span>
                    <span className="right-text" onClick={this.navigatePublishPage}>完成</span>
                </div>
            );
        } else if (this.state.stages === "three") {
            return(
                <div className="header-wrapper">
                    <span className="left-text" onClick={this.navigatePreviewArticle}>
                        <Icon type="left" style={{fontSize: "16px", color: '#888', fontWeight: "bold"}} />
                    </span>
                    <span className="center-text"></span>
                    <span className="right-text">发布</span>
                </div>
            );
        } else {
            return;
        }
    }

    renderStageOne() {
        return(
            <div className="stage-one-container">
                <input
                    type="text"
                    className="title-input"
                    onChange={this.titleChange}
                    value={this.state.title}
                    placeholder="title"
                />
                <Editor
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor editor-area"
                    toolbarClassName="demo-toolbar-absolute toolbar-area"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        options: [
                            "image",
                            "inline",
                            "blockType",
                            "fontSize",
                            "history",
                            "link",
                            "emoji",
                            "textAlign",
                        ],
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: false },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
            </div>
        );
    }

    renderStageTwo() {
        if(!this.state.title || !this.state.mainContent) {
            return(
                <div>标题或者正文为空，请返回上一级进行编辑 ！</div>
            );
        }

        return(
            <div>
                <PreviewArticle
                    title={this.state.title}
                    mainContent={this.state.mainContent}
                /> 
            </div>
        );
    }

    renderStageThree() {
        
        return(
            <div className="publish-article-page">
                <div className="upload-surface-image-wrapper" onClick={this.uploadSurfaceImg}>
                    <Icon type="upload" style={{fontSize: "32px", color: '#888', fontWeight: "bolder",}} />
                    <div style={{fontSize: 15, color: '#9c9c9c',}}>设置文章封面</div>
                </div>
                <div className="operate-add-label" onClick={this.addArticleLabel}>
                    <Icon type="plus" style={{color: '#979797', fontSize: 16, marginRight: "20px"}}  />
                    <span className="operate-text">添加标签</span>
                </div>
                <div className="operate-add-label" onClick={this.addArticleLabel}>
                    <Icon type="eye" style={{color: '#979797', fontSize: 16, marginRight: "20px"}}  />
                    <span className="black-operate-text">公开发表</span>
                </div>
                <div className="operate-add-label" onClick={this.addArticleLabel}>
                    <Icon type="copyright" style={{color: '#979797', fontSize: 16, marginRight: "20px"}}  />
                    <span className="black-operate-text">版权声明</span>
                </div>
            </div>
        );
    }

    render() {
        
        return(
            <div className="container">
                {
                    this.renderHeaderCommon()
                }

                {
                    this.state.stages === "one" ? this.renderStageOne() : ""
                }

                {
                    this.state.stages === "two" ? this.renderStageTwo() : ""
                }
                
                {
                    this.state.stages === "three" ? this.renderStageThree() : null
                }
            </div>
        );
    }
}

export default Articles;
