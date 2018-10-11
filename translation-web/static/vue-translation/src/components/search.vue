<template>
    <div class="search">
        <p class="title">查询筛选</p>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-box">
            <el-form-item label="Language" prop="language">
                <el-select v-model="form.language" size="medium" placeholder="请选择查询的语言数据库">
                    <el-option 
                    v-for="(item,index) in languageList"
                    :key="index"
                    :label="item.label" 
                    :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="ID" prop="id">
                <el-col :span="8">
                    <el-input size="medium" v-model="form.id"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="中文" prop="chinese">
                <el-col :span="12">
                    <el-input type="textarea" placeholder="请输入中文" autosize v-model="form.chinese"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="译文" prop="translation">
                <el-col :span="12">
                    <el-input class="input-textarea" type="textarea" placeholder="请输译文" autosize v-model="form.translation"></el-input>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button size="medium" @click="check">查询</el-button>
                </el-col>
            </el-form-item>
        </el-form>

        <p class="title">查询结果</p>

        <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalNum">
        </el-pagination>

        <!-- 
            current-change : 当前页数改变触发
            current-page   : 当前页数
            page-size      : 每页显示的条目数
            total          : 总条目数
         -->
        
        <el-table
        :data="resultData"
        v-loading="isLoading"
        border>
            <el-table-column
            prop="id"
            label="ID">
            </el-table-column>

            <el-table-column
            prop="text"
            label="text">
            </el-table-column>

            <el-table-column
            prop="translation"
            class-name="col-translation"
            label="translation">
                <template slot-scope="scope">
                    
                    <el-input v-if="editor_index == scope.$index" class="input-editor" 
                    type="textarea" 
                    placeholder="" 
                    :autosize="{ minRows: 4 }" 
                    v-model="editor_text"></el-input>

                    <span v-else>{{ scope.row.translation }}</span>
                    
                    <div class="col-tip" v-show="tip_isShow" @click="editor(scope.$index, scope.row)">
                        <span>编辑</span>
                    </div>

                    <div class="col-box" v-show="editor_index == scope.$index">
                        <div class="col-oper oper-save" @click="save(scope.row)">
                            保存
                        </div>
                        <div class="col-oper oper-cancel" @click="cancel">
                            取消
                        </div>
                    </div>
                    
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        let validatePass = (rule, value, callback) => {
            let reg = /.*[\u4e00-\u9fa5]+.*$/ ;
            if (value) {
                 if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('不含有中文'));
                }
            } else {
                callback();
            }
        }
        
        return {
            form: {
                language: '',
                id: '',
                chinese: '',
                translation: '',
            },
            languageList: [],
            resultData: [],

            // 查询参数
            search_params: {
            },
            
            // 分页
            currentPage: 1,
            totalNum: 0,
            pageSize: 50,
            
            // 编辑
            editor_text: '',
            old_translation: '',
            editor_index: -1,
            tip_isShow: true,
            
            isLoading: false,
            rules: {
                language: [
                    { required: true, message: '请选择查询的语言数据库', trigger: 'change' }
                ],
                chinese: [
                    // { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 请求languageList
        this.$ajax.getLanguageList().then(response => {
            console.log(response);
            if (response.data.sta !== -1) {
                this.languageList = response.data.data;
            }
        })
    },
    methods: {
        check() {
            this.$refs['form'].validate((valid) => {
                if (valid) {

                    this.search_params = {
                        language    : this.form.language,
                        id          : this.form.id,
                        chinese     : this.form.chinese,
                        translation : this.form.translation,
                        pagesize    : this.pageSize,
                        currentpage : this.currentPage,
                        hasinfo     : true,
                    }
                    
                    this.currentPage = 1;   //当前页数重置为1
                    this.search();
                    
                } else {
                    return false;
                }
            })
        },
        search(hasInfo = true, currentpage = 1) {
            /* 
            hasInfo: 查询结果是否有提示
            currentpage: 当前页数
             */
            this.isLoading = true;

            this.search_params.hasinfo = hasInfo;
            this.search_params.currentpage = currentpage;

            this.$ajax.searchLanguage(this.search_params).then(response => {
                this.isLoading = false;
                console.log(response);

                if (response.data.sta !== -1) {
                    this.resultData = response.data.data.result;
                    this.totalNum = response.data.data.total;
                } else {
                    this.resultData = [];
                }
                
            }).catch(err => {
                this.isLoading = false;
                console.log(err);
            })
        },

        handleCurrentChange(val) {
            this.search(true, val);
        },

        editor(index, params) {
            this.editor_index = index;
            this.editor_text = params.translation;
            this.old_translation = params.translation;

            this.tip_isShow = false;
        },
        cancel() {
            this.editor_index = -1;
            this.tip_isShow = true;
        },
        save(params) {

            let obj = {
                id: params.id,
                old_translation: this.old_translation,
                new_translation: this.editor_text,
                language: this.form.language,
            }
            console.log(obj);

            // 去掉多余换行符 和 开头结尾多余的空格
            obj.new_translation = obj.new_translation.replace(/^[\s]+|[\s]+$|[\r\n]/g, '');
            
            this.$ajax.update(obj).then(response => {
                console.log(response);
                if (response.data.sta !== -1) {
                    this.editor_index = -1;
                    this.tip_isShow = true;
                    // 无提示查询
                    this.search(false, this.currentPage);
                }
            })
            
        }

    }
}
</script>

<style lang="scss">
.el-pager {
    color: #5e5e5e;
}
.col-translation{
    position: relative;
    .col-tip {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: #B3C0D1;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0, 0, 0, .175);
        opacity: 0;
        transition: opacity .3s, box-shadow .3s;
        &:hover{
            box-shadow: none;
        }
        span {
            position: absolute;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            line-height: 1;
            color: #fff;
        }
    }
    .col-box{
        width: 40px;
        height: auto;
        float: right;
        padding: 5px;
        box-sizing: content-box;
        .col-oper {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            writing-mode: vertical-rl;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0, 0, 0, .175);
            transition: opacity .3s, box-shadow .3s;
            color: #fff;
            &:hover{
                box-shadow: none;
            }
        }
        .oper-save {
            background: #f4b3c2;
            margin-bottom: 10px;
        }
        .oper-cancel {
            background: #a69abd;
        }
    }
    
    .input-editor {
        width: 80%;
    }
    &:hover {
        .col-tip{
            opacity: 1;
        }
    }
    
}
</style>

<style lang="scss" scoped>
.search{
    overflow: hidden;
}
.title {
    background: #E9EEF3;
    width: 120px;
    font-size: 18px;
    color: #333;
    text-align: right;
    padding: 3px 5px;
    border-right: 3px solid #B3C0D1;
    margin-top: 30px;
    margin-bottom: 30px;
}

.form-box{
    width: 100%;
}

.el-pagination{
    text-align: right;
}
.el-table{
    margin-top: 10px;
    margin-bottom: 50px;
}
</style>