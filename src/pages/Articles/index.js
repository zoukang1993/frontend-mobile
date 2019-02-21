import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


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

    previewArticle = () => {
        const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

        if (this.isOneStage("one")) {
            this.setState({
                stages: 'two',
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
                <div>
                    <span onClick={this.cancelArticle}>取消</span>
                    <span>发表文章</span>
                    <span onClick={this.previewArticle}>下一步</span>
                </div>
            );
        } else if (this.state.stages === "two") {
            return(
                <div>
                    <span onClick={this.navigateEditroArticle}>继续编辑</span>
                    <span>预览</span>
                    <span>完成</span>
                </div>
            );
        } else if (this.state.stages === "three") {
            return(
                <div>
                    <span>back</span>
                    <span></span>
                    <span>发布</span>
                </div>
            );
        } else {
            return;
        }
    }

    renderStageOne() {
        return(
            <div className="text-editor-area">
                <input
                    type="text"
                    className="title-input"
                    onChange={this.titleChange}
                    value={this.state.title}
                    placeholder="title"
                />
                <Editor
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    toolbarClassName="demo-toolbar-absolute"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        options: [
                            "image",
                            "fontSize",
                            "textAlign",
                            "link",
                        ],
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: false },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />


                <textarea
                    disabled
                    placeholder="area"
                    value={this.state.editorState.getCurrentContent()}
                />
            </div>
        );
    }

    renderStageTwo() {
        return(
            <div>
                stage-two
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
