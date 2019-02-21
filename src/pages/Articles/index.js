import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import PreviewArticle from './PreviewArticle';


@inject('stores')
@observer
class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            stages: "one",
            title: '',
            mainContent: '',
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
        const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

        if (this.isOneStage("one")) {
            this.setState({
                stages: 'two',
                mainContent: value,
            });
        }

        
        console.log(value);
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

    renderHeaderCommon() {
        if (this.state.stages === "one") {
            return(
                <div className="header-wrapper">
                    <span className="left-text" onClick={this.cancelArticle}>取消</span>
                    <span className="center-text">发表文章</span>
                    <span className="right-text" onClick={this.navagatePreviewArticle}>下一步</span>
                </div>
            );
        } else if (this.state.stages === "two") {
            return(
                <div className="header-wrapper">
                    <span className="left-text" onClick={this.navigateEditroArticle}>继续编辑</span>
                    <span className="center-text">预览</span>
                    <span className="right-text">完成</span>
                </div>
            );
        } else if (this.state.stages === "three") {
            return(
                <div className="header-wrapper">
                    <span className="left-text">back</span>
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
