// 《响应式系统的依赖收集追踪原理》

class Dep {
    constructor () {
        this.subs = [];
    }

    addSub (sub) {
        this.subs.push(sub);
    }

    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}

function pushTarget () {

}

function popTarget () {

}

export default Dep

export {
    pushTarget,
    popTarget
}
