<template>
    <div>
        <g-header></g-header>
        <div class="content">
            <div class="container">
                <div class="link-box">
                    <router-link 
                    v-for="(item, index) in linkList"
                    :key="index"
                    :to="item.path"
                    @click.native="selectLink(index)"
                    :class="[index == linkIndex ? 'linkActived' : '']"
                    >{{ item.name }}</router-link>
                </div>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import header from "../components/header"

export default {
    components: {
        'g-header': header,
    },
    data() {
        return {
           linkList: [
               { path: '/search', name: 'search' },
               { path: '/logs', name: 'logs' },
           ],
           linkIndex: 0,
        }
    },
    created() {
        for(let i = 0, len = this.linkList.length; i < len; i++) {
            if (this.linkList[i].name == this.$route.name) {
                this.linkIndex = i;
            }
        }
        
    },
    methods: {
        selectLink(index) {
            this.linkIndex = index;
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    width: 100%;
    padding-top: 80px;
    .container{
        position: relative;
        .link-box{
            position: absolute;
            left: -200px;
            top: 100px;
            text-align: right;
            border-right: 1px dashed #B3C0D1;
            padding: 10px;
            transition: left .3s;
            a {
                display: block;
                width: 130px;
                height: 30px;
                box-sizing: border-box;
                line-height: 30px;
                font-size: 19px;
                background: #E9EEF3;
                color: #333;
                padding: 0 20px;
                transition: padding .2s;
                @media screen and (max-width: 1110px) {
                    text-align: left;
                    
                }
            }
            a:not(:last-child) {
                margin-bottom: 10px;
            }
            .linkActived{
                border-right: 3px solid #B3C0D1;
                padding-right: 12px;
                @media screen and (max-width: 1110px) {
                    border-left: 3px solid #B3C0D1;
                    padding-left: 12px;
                }
            }
            @media screen and (max-width: 1110px) {
                position: fixed;
                left: 91%;
                top: 100px;
                z-index: 98;
            }
            @media screen and (max-width: 1020px) {
                position: fixed;
                left: 95%;
                top: 100px;
                z-index: 98;
            }
        }
    }
    
}
</style>

