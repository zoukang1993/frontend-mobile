import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {computed} from 'mobx';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import PreviewArticle from './PreviewArticle';
import './index.scss';
import {Link} from 'react-router-dom';

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
        this.fileInput = React.createRef();
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
        this.initStatus();
    }

    componentDidMount() {
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

    navagatePreviewArticle = () => {
        const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())).trim();
        
        if (this.isOneStage("one")) {
            if(!this.state.title) {
                return;
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

    uploadSurfaceImage = async (event) => {
        event.preventDefault();
        let file = this.fileInput.current.files[0];
        let {key} = await await this.uploadImage(file);

        if (!key) {
            return;
        }

        this.setState({
            surfaceImage: 'https://file.kuipmake.com/' + key,
        });
    }

    removeSurfaceImage = () => {
        this.setState({
            surfaceImage: '',
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

        let index = this.findLabelInArray(tagObj);
        if (index >= 0) {
            return;
        }

        this.setState({
            tags: this.state.tags.concat(tagObj),
        });

        this.inputVal = '';
    }

    findLabelInArray(itemObj) {
        let tags = this.state.tags;
        let index = tags.indexOf(itemObj);
        return index;
    }

    removeTag = (item) => {
        let tags = this.state.tags;
        let deleteIndex = this.findLabelInArray(item);
        tags.splice(deleteIndex, 1);

        this.setState({
            tags: tags,
        });
    }

    isPublicPublish = () => {}

    copyrightNotice = () => {}

    submitArticle = async() => {
        if (!this.state.surfaceImage || !this.state.title || !this.state.type || !this.state.mainContent) {
            return;
        }

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
                this.props.history.replace(`/ArticleDetail/${res.id}`);
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
                    <Link to='/' className="left-text">
                        <svg className="icon icon-fanhui" aria-hidden="true">
                            <use xlinkHref="#icon-fanhui"></use>
                        </svg>
                    </Link>
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
                        <svg className="icon icon-fanhui" aria-hidden="true">
                            <use xlinkHref="#icon-fanhui"></use>
                        </svg>
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
                    editorState={this.state.editorState}
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
                <div className="upload-surface-image-wrapper">
                    <div className="upload-text-icon">
                        <svg className="icon icon-shangchuan" aria-hidden="true">
                            <use xlinkHref="#icon-shangchuan"></use>
                        </svg> <br />
                        <span>设置文章封面</span>
                    </div>
                    <input
                        className="upload-surface-input"
                        type="file"
                        onChange={this.uploadSurfaceImage}
                        ref={this.fileInput}
                    />
                </div>
                <div>
                    {
                        this.state.surfaceImage ? 
                            <div className="surface-image-show-area">
                                <img src={this.state.surfaceImage} className="image" alt="封面图" className="surface-image-show" /> 
                                <span onClick={this.removeSurfaceImage} className="remove-surface-image-icon">
                                    <svg className="icon icon-shanchu" aria-hidden="true">
                                        <use xlinkHref="#icon-shanchu"></use>
                                    </svg>
                                </span>
                            </div>
                        : ''
                    }
                </div>
                <div className="operate-add-label">
                    <span onClick={this.addTag}>
                        <svg className="icon icon-add" aria-hidden="true">
                            <use xlinkHref="#icon-add"></use>
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="label-input"
                        defaultValue=''
                        placeholder="添加标签"
                        onChange={this.handleAddTags}
                    />
                    <div>
                        {
                            this.state.tags ? this.state.tags.map((item) => {
                                return(
                                    <span key={item.name} className="label-show-item">
                                        <span>{item.name}</span>
                                        <span onClick={() => this.removeTag(item)}>
                                            <svg className="icon icon-shanchu" aria-hidden="true">
                                                <use xlinkHref="#icon-shanchu"></use>
                                            </svg>
                                        </span>
                                    </span>
                                )
                            }) : ''
                        }
                    </div>
                </div>
                <div className="operate-add-label" onClick={this.isPublicPublish}>
                    <span onClick={this.isPublicPublish}>
                        <svg className="icon icon-gongkai" aria-hidden="true">
                            <use xlinkHref="#icon-gongkai"></use>
                        </svg>
                    </span>
                    <span className="black-operate-text">公开发表</span>
                </div>
                <div className="operate-add-label" onClick={this.copyrightNotice}>
                    <svg className="icon icon-banquan" aria-hidden="true">
                        <use xlinkHref="#icon-banquan"></use>
                    </svg>
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
