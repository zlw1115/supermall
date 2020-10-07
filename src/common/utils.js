// 防抖动函数
export function debounce(func, delay){
  let timer = null
  return function (...args) {
    if (timer) timer = clearInterval

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}