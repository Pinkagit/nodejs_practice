<template>
    <div class="logs">
        <p class="title">日志查询</p>
        <el-form ref="form" :inline="true" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="查询时间" prop="time">
                <el-date-picker
                v-model="formData.time"
                align="left"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button @click="Submit">确定</el-button>
            </el-form-item>
        </el-form>

        <p class="title">查询结果</p>
        <el-table
        :data="logs"
        v-loading="isLoading"
        v-show="isShow"
        border>
            <el-table-column
            prop="time"
            min-width="140"
            align="center"
            label="Time">
            </el-table-column>

            <el-table-column
            prop="user"
            align="center"
            width="80"
            label="user">
            </el-table-column>

            <el-table-column
            prop="oper"
            width="80"
            align="center"
            label="oper">
            </el-table-column>

            <el-table-column
            prop="tablename"
            align="center"
            label="tablename">
            </el-table-column>

            <el-table-column
            prop="old_translation"
            label="old_translation">
            </el-table-column>

            <el-table-column
            prop="new_translation"
            label="new_translation">
            </el-table-column>

            <el-table-column
            prop="result"
            align="center"
            width="80"
            label="result">
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                time: ''
            },
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            rules: {
                time: [
                    { type: 'date', required: true ,message: '请选择日期', trigger: 'change' }
                ]
            },
            logs: [],
            isLoading: false,
            isShow: false,
        }
    },
    methods: {
        Submit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.search();
                } else {
                    return false;
                }
            })         
            
        },
        search() {
            this.isShow = true;
            this.isLoading = true;
            
            let obj = {
                begintime: Date.parse(new Date(this.formData.time))
            }

            this.$ajax.getLosg(obj).then(response => {
                this.isLoading = false;
                
                console.log(response);
                if (response.data.sta !== -1 && response.data.data !== '') {
                    this.logs = [];
                    
                    let content = response.data.data.replace(/[\r\n]/g, '');
                    let arrRet = content.split("[translationLog_end]");
                    let log_p = arrRet.filter((item) => {
                        if (item.length !== 0) {
                            return item;
                        }
                    })

                    for(let i = 0, len = log_p.length; i < len; i++) {
                        log_p[i] = log_p[i].replace(/[\s]+$/g, '');
                        let log_tr = log_p[i].split('[translationLog_br]')

                        let log_obj = {}
                        
                        for(let j = 0, len = log_tr.length; j < len; j++) {

                            if (log_tr[j].length !== 0) {
                                if (j > 0) {
                                    let log_td = log_tr[j].split("[translationLog]")

                                    let key = this.trim(log_td[0])
                                    let value = this.trim(log_td[1])

                                    log_obj[key] = value;
                                } else if (j == 0) {
                                    log_obj['time'] = log_tr[j].slice(1, 24)
                                }
                            }
                        }
                        this.logs.push(log_obj);        
                    }
                } else if (response.data.sta !== -1 && response.data.data == '') {
                    this.logs = [];
                }
            }).catch(err => {
                this.isLoading = false;
            })
        },
        trim(str) {
            // 去除前后空格
            return str.replace(/^[\s]+|[\s]+$/g, '');
        }
    }
}
</script>


<style lang="scss" scoped>
.logs{
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
.log_box{
    color: #5e5e5e;
}
</style>

