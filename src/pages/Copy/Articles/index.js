import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {computed} from 'mobx';
import './index.scss';
import {Link} from 'react-router-dom';
import PreviewArticle from './PreviewArticle';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

@inject('stores')
@observer
class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: null,
            stages: "one",
            type: 'article',
            title: '',
            mainContent: '',
            surfaceImage: '',
            tags: [],
        };

        this.fileInput = React.createRef();

        this.modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                // [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                ['clean'],
            ],
        };
        
        this.formats = [
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            // 'list', 'bullet', 'indent',
            'link', 'image',
        ];
    }

    @computed get articalStore() {
        return this.props.stores.articalStore;
    }

    @computed get userStore() {
        return this.props.stores.userStore;
    }

    handleChange = (editorState) => {
        this.setState({
            editorState,
        });
    }

    initStatus = () => {
        this.inputVal = '';

        this.setState({
            editorState: null,
            stages: "one",

            type: 'article',
            title: '',
            mainContent: '',
            surfaceImage: '',
            tags: [],
        });
    }

    componentDidMount() {
        // this.initStatus();
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

    isOneStage(stage) {
        if (this.state.stages === stage) {
            return true;
        }

        return false;
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    }

    navagatePreviewArticle = () => {
        let value = this.state.editorState.trim();
        
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

    submitArticle = async () => {
        if (!this.state.surfaceImage || !this.state.title || !this.state.type || !this.state.mainContent) {
            return;
        }

        const params = {
            cover: this.state.surfaceImage,
            tags: this.state.tags,
            title: this.state.title,
            type: this.state.type,
            content: this.state.mainContent,
            status: "published",
        };

        this.handleSubmitArticle(params);
    }

    saveDraft = () => {
        if (!this.state.title || !this.state.type || !this.state.mainContent) {
            return;
        }

        this.setState({
            status: 'draft',
        }, () => {
            const params = {
                cover: this.state.surfaceImage,
                tags: this.state.tags,
                title: this.state.title,
                type: this.state.type,
                content: this.state.mainContent,
                status: 'draft',
            };

            this.handleSubmitArticle(params);
        })
    }

    handleSubmitArticle = async (params) => {
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
                <ReactQuill
                    theme="snow"
                    modules={this.modules}
                    formats={this.formats}
                    defaultValue={this.state.value}
                    placeholder="Please Input"
                    value={this.state.editorState}
                    onChange={this.handleChange}
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
                <div className="upload-surface-image-wrapper">
                    {
                        !this.state.surfaceImage ? 
                        <div>
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
                        :
                        <div className="surface-image-show-area">
                            <img src={this.state.surfaceImage} alt="封面图" className="surface-image-show" /> 
                            <span onClick={this.removeSurfaceImage} className="remove-surface-image-icon">
                                <svg className="icon icon-shanchu" aria-hidden="true">
                                    <use xlinkHref="#icon-shanchu"></use>
                                </svg>
                            </span>
                        </div>
                    }
                </div>
                <div className="operate-add-label">
                    <div className="add-label-header">
                        <span>#</span>
                        <span className="add-label-text">添加标签</span>
                        <span onClick={this.addTag}>
                            <svg className="icon icon-add" aria-hidden="true">
                                <use xlinkHref="#icon-add"></use>
                            </svg>
                        </span>
                    </div>
                    
                    <input
                        type="text"
                        className="label-input"
                        defaultValue=''
                        placeholder=""
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
                <div className="operate-add-label operate-inline" onClick={this.isPublicPublish}>
                    <span className="operate-left-part">
                        <svg className="icon icon-gongkai" aria-hidden="true">
                            <use xlinkHref="#icon-gongkai"></use>
                        </svg>
                        <span className="black-operate-text">公开发表</span>
                    </span>
                    <span className="operate-icon-forward">&gt;</span>
                </div>
                <div className="operate-add-label operate-inline" onClick={this.copyrightNotice}>
                    <span className="operate-left-part">
                        <svg className="icon icon-banquan" aria-hidden="true" style={{color: 'red', fontSize: 20}}>
                            <use xlinkHref="#icon-banquan"></use>
                        </svg>
                        <span className="black-operate-text">版权声明</span>
                    </span>
                    <span className="operate-icon-forward">&gt;</span>
                </div>
                <div className="save-article-draft-btn" onClick={this.saveDraft}>
                    存草稿
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
