import { createRouter,createWebHistory } from "vue-router";
import { constRoute } from "./routes";
export default createRouter({ 
    history:createWebHistory(),
    routes: constRoute,
    // 滚动行为(这个倒是第一次学)
    scrollBehavior(){
        return {
            left: 0,
            top: 0
        }
    }
});