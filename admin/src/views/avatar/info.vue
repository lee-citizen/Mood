    <template>
    <div class="classify-new" v-loading.fullscreen.lock="fullscreenLoading">
        <section>
        <h2 class="tit">添加头像</h2>
        <el-select v-model="data.classify_id" placeholder="分类id"  @change="classifyChange" >
            <el-option v-for="item in classifyList" :key="item._id" :label="item.name" :value="item._id"> </el-option>
        </el-select>
        </section>
        <section>
        <div class="upload-box" v-if="!isUpload">
            <el-upload
            v-for="(item, index) in ['image']"
            :key="index"
            :show-file-list="false"
            :http-request="uploadChange"
            :name="item"
            class="upload-item"
            ref="upload"
            action
            drag
            >
            <template>
                <img v-if="data.image.url" :src="data.image.url" />
                <template v-else>
                <i class="el-icon-picture-outline-round"></i>
                <div class="el-upload__text">图片</div>
                </template>
            </template>
            </el-upload>
        </div>
        </section>
        <el-button type="primary" class="submit" @click="submit">SUBMIT</el-button>
    </div>
    </template>

    <script>
    import Date from '@/components/date'
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
    components: {
        Date,
        mavonEditor
    },
    data() {
        return {
        id: '', // 当前分类id（编辑）
        data: {
            image: {}
        },
        classifyList: [],
        markdownImage: [], // 编辑器的图片集合
        isUpload: false, // 是否上传 取反

        fullscreenLoading: false
        }
    },
    computed: {
        uploadType() {
        return this.$store.state.$data.info.base.upload_type
        }
    },
    created() {
        this.id = this.$route.query.id
        console.log(this.id)
        this.id && this.loadData(this.id)
        this.load()
    },
    methods: {
        classifyChange(e){
            this.classifyList.forEach(item => {
                if (item._id == e) {
                    this.data.classify_name = item.name
                }
            });
        },
        load() {
        this.$request(() =>
            this.$http
            .get('/classify', {
                params: {}
            })
            .then(res => {
                console.log(res.data.body.data)
                this.classifyList = res.data.body.data
                // ;['data', 'total', 'page'].map(i => (this[i] = res.data.body[i]))
            })
        )
        },
        // 
        loadData(id) {
        this.$request(() =>
            this.$http.get(`avatar/${id}`).then(res => {
            if (res.data.status === 1) {
                this.data = res.data.body
            } else {
                this.$message.error(res.data.body.message)
            }
            })
        )
        },
        uploadChange(data) {
        const list = ['audio', 'image']
        const name = data.filename == 'music' ? 'audio' : data.filename
        const index = list.indexOf(data.file.type.split('/')[0])

        if (name != list[index]) {
            this.$message.error(`请选择${name}格式的文件!`)
            return
        }
        this.uploads(data.filename, data.file, true)
        },
        // 保存临时文件
        uploads(type, file, is) {
        const form = this.$formData({
            file: file,
            type: this.uploadType
        })
        if (is) {
            this.$set(this.data, type, {
            url: URL.createObjectURL(file),
            name: file.name,
            form
            })
        } else {
            this.markdownImage.push({
            // 内容区图片
            index: type,
            form
            })
        }
        },
        $imgDel(index) {
        this.markdownImage.splice(index, 1)
        },

        async submit() {
        // 上传背景音乐 & 封面图
        if (!this.isUpload) {
            for (let i of ['image']) {
            const data = this.data[i]
            if (data.form) {
                const res = await this.$http.post('/upload', data.form)
                if (res.data.status == 1) {
                data.url = res.data.body.url
                delete data.form
                } else {
                this.$message.error(res.data.body.message)
                this.fullscreenLoading = false
                return
                }
            }
            }
        }

        this.fullscreenLoading = true
        const type = this.id ? `avatar/${this.data._id}` : 'avatar'
        console.log(type)
        const mesg = this.id ? '更新' : '发表'
        console.log(this.data)

    // return;
        this.$http.post(type, { data: this.data }).then(res => {
            if (res.data.status === 1) {
            this.$message.success(`${mesg}成功`)
            this.$router.push('/avatar')
            this.$infoUpdate()
            } else {
            this.$message.error(`${mesg}失败，请检查网络问题!`)
            }
            this.fullscreenLoading = false
        })
        },
        // 获取时间
        getDate(val) {
        this.data.time = val
        }
    }
    }
    </script>

    <style lang="scss" scoped>
    section {
    margin: 15px 0;
    .el-switch,
    .el-input {
        width: 100%;
        height: 38px;
        margin: 8px 0;
    }
    }
    .markdown-body {
    height: 65vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
    }
    .submit {
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
    }
    .upload-box {
    display: flex;
    margin: 10px -7px 6px;
    .upload-item {
        width: 50%;
        max-width: 200px;
        margin: 0 7px;
        ::v-deep .el-upload {
        width: 100%;
        .el-upload-dragger {
            width: 100%;
            .el-icon-picture-outline-round,
            .el-icon-headset {
            font-size: 46px;
            color: #c0c4cc;
            margin: 42px 0 14px;
            line-height: 50px;
            transition: all 0.3s;
            }
            .el-upload__text {
            color: #98999c;
            transition: all 0.3s;
            }
            &:hover {
            .el-icon-picture-outline-round,
            .el-upload__text,
            .el-icon-headset {
                color: #409eff;
            }
            }
        }
        }
    }
    img {
        width: 100%;
    }
    }
    ::v-deep .el-switch__label {
    color: #98999c;
    font-weight: 400;
    &.is-active {
        color: #409eff;
    }
    }
    @media screen and (max-width: 600px) {
    .markdown-body {
        height: 90vh !important;
        box-shadow: none !important;
    }
    section {
        margin: 10px 0;
        box-shadow: none;
    }
    .submit {
        width: 150px;
        height: 36px;
        margin: 0 0 20px;
        line-height: 36px;
        padding: 0;
    }
    .upload-box .upload-item ::v-deep .el-upload .el-upload-dragger {
        height: 130px;
        .el-icon-picture-outline-round,
        .el-icon-headset {
        font-size: 36px;
        margin: 22px 0 10px;
        }
    }
    }
    </style>
