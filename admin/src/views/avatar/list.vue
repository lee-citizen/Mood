    <template>
    <div class="article">
        <h2 class="tit">
        头像列表 ({{ total }})
        <span @click="newArticle" class="add"><span class="el-icon-plus"></span> 新头像</span>
        </h2>
        <!-- classifyList -->
        <div>
        <el-select v-model="classify_id" placeholder="分类id" clearable  @change="classifyChange">
            <el-option v-for="item in classifyList" :key="item._id" :label="item.name" :value="item._id"> </el-option>
        </el-select>
        </div>
        <el-table :data="data">
        <el-table-column label="Title">
            <template slot-scope="scope">
            <el-avatar shape="square" :size="'medium'" :src="scope.row && scope.row.image.url"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column label="Title">
            <template slot-scope="scope">
            <p>{{ scope.row && scope.row.image.name }}</p>
            </template>
        </el-table-column>
        <el-table-column label="ClassName">
            <template slot-scope="scope">
            <p>{{ scope.row.classify_name }}</p>
            </template>
        </el-table-column>
        <el-table-column label="options" width="100">
            <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="item.text" placement="top" v-for="(item, index) in options" :key="index">
                <i :class="item.icon" @click="option(scope.row, index)"></i>
            </el-tooltip>
            </template>
        </el-table-column>
        </el-table>

        <Pagination :data="total" :page="page" @update="load" />
    </div>
    </template>

    <script>
    import Pagination from '@/components/Pagination'
    export default {
    components: {
        Pagination
    },
    data() {
        return {
        data: [],
        classifyList: [],
        total: 0,
        page: 1,
        classify_id: '',
        options: [
            // {
            // icon: 'el-icon-view',
            // text: 'View avatar'
            // },
            {
            icon: 'el-icon-edit',
            text: 'Edit Avatar'
            },
            {
            icon: 'el-icon-delete',
            text: 'Delete'
            }
        ],
        classify_id:'',
        }
    },
    created() {
        this.load()
        this.loadClassify()
    },
    methods: {
        classifyChange(e){
            if (this.classify_id !=e) {
                this.page = 1;
            }
            this.classify_id = e;
            this.load(this.page,e)
        },
        loadClassify() {
        this.$request(() =>
            this.$http
            .get('/classify', {
                params: {

                }
            })
            .then(res => {
                console.log(res.data.body.data)
                this.classifyList = res.data.body.data
            })
        )
        },
        newArticle() {
        this.$router.push('/avatar/info')
        },
        load(page,classify_id) {
        this.$request(() =>
            this.$http
            .get('/avatar', {
                params: { page,classify_id }
            })
            .then(res => {
                ;['data', 'total', 'page'].map(i => (this[i] = res.data.body[i]))
            })
        )
        },
        option(data, index) {
        const o = {
            0: () => {
            this.$router.push({
                name: 'avatarInfo',
                query: {
                id: data._id
                }
            })
            },
            1: () => {
            this.$confirm('删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                this.$request(() =>
                    this.$http.delete(`avatar/${data._id}`).then(res => {
                    if (res.data.status === 1) {
                        this.load()
                        this.$message.success('删除成功！')
                    } else {
                        this.$message.error(res.data.body.message)
                    }
                    })
                )
                })
                .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
                })
            }
        }
        o[index]()
        }
    }
    }
    </script>

    <style lang="scss" scoped>
    .article {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
        h1 {
        border-left: 2px solid #0084ff;
        padding-left: 16px;
        font-size: 18px;
        font-weight: 400;
        margin: 20px 0 30px;
        color: #0084ff;
        }
        .info {
        display: flex;
        margin: 15px 0;
        div {
            margin-right: 10px;
        }
        }
    }
    .article-list {
        width: 100%;
        thead tr {
        height: 40px;
        }
        tbody {
        tr {
            height: 50px;
        }
        }
    }
    i[class*='el-icon-'] {
        cursor: pointer;
        margin: 2px;
        padding: 2px;
        font-size: 14px;
        color: #cfcfcf;
        transition: all 0.2s;
        &:hover {
        color: #0e8bff;
        }
        &.el-icon-delete:hover {
        color: red;
        }
    }
    ::v-deep .el-table__body-wrapper {
        height: calc(100% - 80px);
        overflow: auto;
        &::-webkit-scrollbar-track {
        background: #fff;
        }
        &::-webkit-scrollbar-thumb {
        background: #eef7ff;
        }
        &::-webkit-scrollbar {
        width: 6px;
        }
    }
    }

    @media screen and (max-width: 600px) {
    .article {
        padding: 0;
        box-shadow: none;
        .header h1 {
        font-size: 16px;
        margin: 10px 0 20px;
        }
    }
    ::v-deep .el-table__body-wrapper {
        height: calc(100vh - 212px) !important;
    }
    .el-table__header,
    .el-table__body {
        width: 100% !important;
        display: block;
        tbody {
        display: block;
        }
        thead {
        display: block;
        tr {
            display: flex;
            th {
            padding: 6px 0;
            &:nth-of-type(2) {
                display: none;
            }
            &:nth-of-type(1) {
                flex: 1;
            }
            &:nth-of-type(3) {
                width: 68px;
                text-align: right;
            }
            .cell {
                padding: 0;
            }
            }
        }
        }
        .el-table__row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        td {
            &:nth-of-type(2) {
            display: none;
            }
            &:nth-of-type(1) {
            flex: 1;
            }
            &:nth-of-type(3) {
            width: 68px;
            text-align: right;
            }
            div {
            padding: 0;
            }
        }
        }
    }
    }
    </style>
