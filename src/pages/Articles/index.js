import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {computed} from 'mobx';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import PreviewArticle from './PreviewArticle';
import {message, Icon, Upload, Input} from 'antd';
import uploadProps from '../../utils/uploadProps';

@inject('stores')
@observer
class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            stages: "one",
            tagModalVisible: false,

            type: 'article',
            title: '',
            mainContent: '',
            surfaceImage: '',
            tags: [],
        };

        this.uploadImageCallBack = this.uploadImageCallBack.bind(this);
    }

    @computed get articalStore() {
        return this.props.stores.articalStore;
    }

    initStatus = () => {
        this.timer && clearTimeout(this.timer);
        this.inputVal = '';

        this.setState({
            editorState: EditorState.createEmpty(),
            stages: "one",
            tagModalVisible: false,

            type: 'article',
            title: '',
            mainContent: '',
            surfaceImage: '',
            tags: [],
        });
    }

    componentWillUnmount() {

    }

    async componentDidMount() {
        this.initStatus();
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    }

    uploadImage = async (file) => {
        const uptoken = await this.articalStore.getUptoken();

        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://up.qbox.me/');
                const data = new FormData();
                data.append('file', file);
                data.append('token', uptoken);
                xhr.send(data);

                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                }, {passive: false});
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                }, {passive: false});
            }
        );
    }

    async uploadImageCallBack(file) {
        let key = '';

        await this.uploadImage(file).then(function(data) {
            key = data.key;
        });

        return {
            data:
                { link: 'https://file.kuipmake.com/' + key}
        };
    }

    isOneStage(stage) {
        if (this.state.stages === stage) {
            return true;
        }

        return false;
    }

    cancelArticle = () => {
        window.location.href = '/';
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

    successUploadSurfaceImg = (res, file) => {
        if (!res.key) {
            return;
        }

        this.setState({
            surfaceImage: `https://file.kuipmake.com/${res.key}`,
        });
    }

    handleAddTags = (e) => {
        this.inputVal = e.target.value || '';

        if (this.inputVal.length < 2 || this.inputVal.length > 8) {
            return;
        }
    }

    addTag = () => {
        if (!this.inputVal) {
            return;
        }

        const tagObj = {
            name: this.inputVal,
        }

        this.setState({
            tags: this.state.tags.concat(tagObj),
        });
    }

    removeTag = (item) => {
        let tags = this.state.tags;
        let deleteIndex = tags.indexOf(item);
        tags.splice(deleteIndex, 1);

        this.setState({
            tags: tags,
        });
    }

    isPublicPublish = () => {}

    copyrightNotice = () => {}

    submitArticle = async() => {
        const params = {
            cover: this.state.surfaceImage,
            tags: this.state.tags,
            title: this.state.title,
            type: this.state.type,
            content: this.state.mainContent,
        };

        try {
            const res = await this.articalStore.createArticle(params);
            if (JSON.stringify(res) !== '{}') {
                // window.location.href = `/ArticleDetail/${res.id}`;
            }

            this.initStatus();
        } catch(e) {
            throw e;
        }
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
                    <span className="right-text" onClick={this.submitArticle}>发布</span>
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
                        inline: {inDropdown: true},
                        list: {inDropdown: true},
                        textAlign: {inDropdown: false},
                        link: {inDropdown: true},
                        history: {inDropdown: true},
                        image: {
                            uploadCallback: this.uploadImageCallBack,
                            uploadEnabled: true,
                            previewImage: true,
                            urlEnabled: true,
                            alignmentEnabled: true,
                            alt: {present: true, mandatory: true}},
                            defaultSize: {
                                height: '200px',
                                width: '240px',
                            },
                    }}
                />
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))}
                /> */}
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
                <Upload {...uploadProps} onSuccess={this.successUploadSurfaceImg}>
                    <div className="upload-surface-image-wrapper">
                        <Icon type="upload" style={{fontSize: "32px", color: '#888', fontWeight: "bolder",}} />
                        <div style={{fontSize: 15, color: '#9c9c9c',}}>设置文章封面</div>
                    </div>
                </Upload>
                <div className="operate-add-label">
                    <Icon type="plus" style={{color: '#979797', fontSize: 16, marginRight: "20px"}} onClick={this.addTag}  />
                    <Input
                        type="text"
                        defaultValue=''
                        placeholder="添加标签"
                        allowClear
                        onChange={this.handleAddTags}
                    />

                    <div>
                        {
                            this.state.tags ? this.state.tags.map((item) => {
                                return(
                                    <span key={item.name} className="label-show-item">
                                        <span>{item.name}</span>
                                        <Icon type="close" style={{marginLeft: 2, }} onClick={() => this.removeTag(item)} />
                                    </span>
                                )
                            }) : ''
                        }
                    </div>
                </div>
                <div className="operate-add-label" onClick={this.isPublicPublish}>
                    <Icon type="eye" style={{color: '#979797', fontSize: 16, marginRight: "20px"}}  />
                    <span className="black-operate-text">公开发表</span>
                </div>
                <div className="operate-add-label" onClick={this.copyrightNotice}>
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
