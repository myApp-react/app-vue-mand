import router from '@/router'

router.beforeEach((to, from, next) => {
    if (to.name === 'home' && /^\?id=\d+&register=1/.test(location.search)) {
        let str = /\?id=\d+/.exec(location.search)[0]
        location.replace(`http://${location.host}/#/register${str}`)
    } else {
        next()
    }
})
