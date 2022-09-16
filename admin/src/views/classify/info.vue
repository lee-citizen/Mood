<template>
    <div class="classify-new" v-loading.fullscreen.lock="fullscreenLoading">
        <section>
            <h2 class="tit">添加分类</h2>
            <el-input placeholder="分类名" v-model="data.name" clearable></el-input>
            <el-input placeholder="排序" v-model="data.sort" type="number"></el-input>
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
            id: '',                     // 当前分类id（编辑）
            data: {
            },
            markdownImage: [],          // 编辑器的图片集合
            isUpload: false,            // 是否上传 取反

            fullscreenLoading: false
        }
    },
    created(){
        this.id = this.$route.query.id
        console.log( this.id );
        this.id && this.loadData(this.id)
    },
    methods: {
        // 获取当前文章的数据
        loadData(id){
            this.$request(() => this.$http.get(`classify/${id}`)
                .then(res => {
                    if (res.data.status === 1) {
                        this.data = res.data.body
                    } else {
                        this.$message.error(res.data.body.message)
                    }
                })
            )
        },
        async submit(){

            this.fullscreenLoading = true
            const type = this.id ? `classify/${this.data._id}` : 'classify';
            console.log(type);
            const mesg = this.id ? '更新' : '发表';
            console.log(this.data );
            this.$http.post(type, { data: this.data })
                .then(res => {
                    if (res.data.status === 1) {
                        this.$message.success(`${mesg}成功`)
                        this.$router.push('/classify')
                        this.$infoUpdate()
                    } else {
                        this.$message.error(`${mesg}失败，请检查网络问题!`);
                    }
                    this.fullscreenLoading = false
                })
        },
        // 获取时间
        getDate(val){
            this.data.time = val
        },
    }
}
</script>

<style lang="scss" scoped>
section{
    margin: 15px 0;
    .el-switch, .el-input{
        width: 100%;
        height: 38px;
        margin: 8px 0;
    }
}
.markdown-body{
    height: 65vh;
    box-shadow: none !important;
    border: 1px solid #eee !important;
}
.submit{
    width: 200px;
    height: 40px;
    font-size: 14px;
    color: #fff;
}
.upload-box{
    display: flex;
    margin: 10px -7px 6px;
    .upload-item{
        width: 50%;
        max-width: 360px;
        margin: 0 7px;
        ::v-deep .el-upload{
            width: 100%;
            .el-upload-dragger{
                width: 100%;
                .el-icon-picture-outline-round,
                .el-icon-headset{
                    font-size: 46px;
                    color: #c0c4cc;
                    margin: 42px 0 14px;
                    line-height: 50px;
                    transition: all .3s;
                }
                .el-upload__text{
                    color: #98999c;
                    transition: all .3s;
                }
                &:hover{
                    .el-icon-picture-outline-round, 
                    .el-upload__text, 
                    .el-icon-headset{
                        color: #409EFF;
                    }
                }
            }
        }
    }
    img{
        width: 100%;
    }
}
::v-deep .el-switch__label{
    color: #98999c;
    font-weight: 400;
    &.is-active{
        color: #409EFF;
    }
}
@media screen and (max-width: 600px) {
    .markdown-body{
        height: 90vh !important;
        box-shadow: none !important;
    }
    section{
        margin: 10px 0;
        box-shadow: none;
    }
    .submit{
        width: 150px;
        height: 36px;
        margin: 0 0 20px;
        line-height: 36px;
        padding: 0;
    }
    .upload-box .upload-item ::v-deep .el-upload .el-upload-dragger{
        height: 130px;
        .el-icon-picture-outline-round, .el-icon-headset{
            font-size: 36px;
            margin: 22px 0 10px;
        }
    }
}
</style>